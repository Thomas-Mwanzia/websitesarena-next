

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Resend } from 'resend';


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import fs from 'fs';
import path, { dirname, join } from 'path';
import multer from 'multer';




dotenv.config();

// When running as an ES module (package.json "type": "module") __dirname is not defined.
// Provide equivalents using import.meta.url so existing code that uses __dirname continues to work.
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Request Logger
const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Input Validation Middleware
const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.details.map(err => err.message)
      });
    }
    next();
  };
};

// Global Middleware
app.use(requestLogger);
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: process.env.MAX_FILE_SIZE }));
app.use(express.static('public'));

// Serve /uploads directory as static files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
if (process.env.NODE_ENV === "production") {
  // Serve the frontend's dist folder


  // Handle all non-API routes by sending index.html
app.get('/', (req, res) => {
  res.send('API is running...');
});

}
// Rate Limiting
const rateLimit = (windowMs, max) => {
  const requests = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const ipAddress = req.ip;
    const userRequests = requests.get(ipAddress) || [];
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= max) {
      return res.status(429).json({ 
        success: false, 
        message: 'Too many requests, please try again later.' 
      });
    }
    
    validRequests.push(now);
    requests.set(ipAddress, validRequests);
    next();
  };
};

// Apply rate limiting to all routes
app.use(rateLimit(15 * 60 * 1000, 200)); // 200 requests per 15 minutes

// Remove API versioning


// Resend configuration
let resend;
try {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured in environment variables');
  }
  resend = new Resend(process.env.RESEND_API_KEY);
  // Test the configuration
  console.log('Initializing Resend with API key:', process.env.RESEND_API_KEY.substring(0, 5) + '...');
} catch (error) {
  console.error('Failed to initialize Resend:', error);
  resend = null;
}

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  company: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  deleteVerifyCode: String,
  deleteVerifyExpires: Date,
  createdAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  technologies: [String],
  liveUrl: String,
  githubUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  website: String,
  feedback: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  image: String,
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'responded'], default: 'unread' },
  createdAt: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  service: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  attended: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const emailLogSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, enum: ['feedback', 'booking', 'message', 'notification'], required: true },
  status: { type: String, enum: ['sent', 'failed'], required: true },
  relatedTo: { type: mongoose.Schema.Types.ObjectId, refPath: 'type' },
  error: String,
  sentAt: { type: Date, default: Date.now }
});

// --- Careers Application Schema ---
const careerApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  message: { type: String, required: true },
  cvUrl: String,
  createdAt: { type: Date, default: Date.now }
});
const CareerApplication = mongoose.model('CareerApplication', careerApplicationSchema);

// Models
const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const Message = mongoose.model('Message', messageSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const EmailLog = mongoose.model('EmailLog', emailLogSchema);

// --- Developer Schema ---
const developerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  paymentDetails: String,
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Developer = mongoose.model('Developer', developerSchema);

// --- Activity Schema ---
const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: String,        // e.g. "Feature", "Bug", "Task"
  status: String,      // e.g. "Open", "In Progress", "Completed"
  priority: String,    // e.g. "High", "Medium", "Low"
  deadline: Date,
  createdAt: { type: Date, default: Date.now },
  developersWorking: { type: Number, default: 0 },
  // Optional: keep a list of developer references for richer information
  developersWorkingList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Developer' }]
});
const Activity = mongoose.model('Activity', activitySchema);

// --- Team Schema ---
const teamMessageReplySchema = new mongoose.Schema({
  author: String,
  text: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
}, { _id: true });

const teamMessageSchema = new mongoose.Schema({
  author: String,
  text: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  readBy: [String], // Add this field
  replies: [{
    author: String,
    text: String,
    email: String,
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    readBy: [String] // Add this field to replies too
  }]
}, { _id: true });

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rank: String,
  techStacks: [String],
  bio: String,
  avatarUrl: String,
  contactEmail: String,
  whatsappGroup: String,  // Add this field
  members: [String], // developer emails
  messages: [teamMessageSchema],
  createdAt: { type: Date, default: Date.now }
});
const Team = mongoose.model('Team', teamSchema);

// --- Visit Schema (for custom analytics) ---
const visitSchema = new mongoose.Schema({
  visitorId: String,       // opaque visitor id from cookie
  path: String,            // page path
  referrer: String,        // document.referrer
  userAgent: String,       // user agent string
  ip: String,              // remote IP
  createdAt: { type: Date, default: Date.now }
});
const Visit = mongoose.model('Visit', visitSchema);

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support tokens issued for both Users (clients/admin) and Developers
    if (decoded && decoded.role === 'developer') {
      // token belongs to a developer
      const dev = await Developer.findById(decoded._id);
      if (!dev) throw new Error();
      // attach both developer and a lightweight user-like object so other middleware expecting req.user.role still work
      req.developer = dev;
      req.user = { _id: dev._id, email: dev.email, role: 'developer', name: dev.name };
      return next();
    }

    // default: token for User (client/admin)
    const user = await User.findById(decoded._id);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

// Admin Authorization Middleware
const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(403).json({ message: 'Access denied.' });
  }
};

// --- File Logger Setup ---
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const logFile = path.join(logDir, 'server.log');

// Append all request logs to file as well
const fileLogger = (req, res, next) => {
  const logLine = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
  fs.appendFile(logFile, logLine, err => {
    if (!err) {
      // Truncate log file to last 200 lines
      fs.readFile(logFile, 'utf8', (err, data) => {
        if (!err) {
          const lines = data.trim().split('\n');
          if (lines.length > 200) {
            const lastLines = lines.slice(-200).join('\n') + '\n';
            fs.writeFile(logFile, lastLines, () => {});
          }
        }
      });
    }
  });
  next();
};
app.use(fileLogger);

// --- Admin Logs Endpoint ---
app.get('/api/admin/logs', async (req, res) => {
  // TODO: Add admin authentication in production
  try {
    const lines = 200; // Number of lines to return
    if (!fs.existsSync(logFile)) return res.json({ success: true, data: [] });
    const data = fs.readFileSync(logFile, 'utf8');
    const allLines = data.trim().split('\n');
    const lastLines = allLines.slice(-lines);
    res.json({ success: true, data: lastLines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Routes

/**
 * @api {post} /api/v1/projects Create a new project
 * @apiName CreateProject
 * @apiGroup Projects
 * @apiHeader {String} Authorization Bearer token
 * @apiBody {String} title Project title
 * @apiBody {String} description Project description
 * @apiBody {File} image Project image
 * @apiBody {String} category Project category
 * @apiBody {String[]} technologies Project technologies
 * @apiSuccess {Object} data Created project
 */
app.post('/api/projects', async (req, res) => { // Temporarily removed auth
  try {
    const { title, description, category, technologies, liveUrl, githubUrl, imageUrl } = req.body;
    
    if (!title || !description || !category || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate and process technologies
    const techArray = Array.isArray(technologies) ? technologies : technologies.split(',').map(tech => tech.trim());

    const project = await Project.create({
      title,
      description,
      imageUrl,
      category,
      technologies: techArray,
      liveUrl,
      githubUrl
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort('-createdAt');
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feedback Routes
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, website, feedback, rating, image } = req.body;
    
    // Validate required fields
    if (!name || !email || !feedback || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate rating
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5'
      });
    }

    // Check for duplicate submission in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const existingFeedback = await Feedback.findOne({
      email,
      feedback,
      createdAt: { $gt: fiveMinutesAgo }
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate feedback submission. Please wait a few minutes before submitting again.'
      });
    }

    // Create feedback with the provided image URL
    const feedbackDoc = await Feedback.create({
      name,
      email,
      website,
      feedback,
      rating: ratingNum,
      image,
      isApproved: false
    });

    // Send notification email to admin
    let emailResult = { success: false };
    let userEmailResult = { success: false };
    const fromAddress = getResendFromAddress();
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail || typeof adminEmail !== 'string' || !adminEmail.includes('@')) {
      console.warn('ADMIN_EMAIL is not set or invalid in environment variables. Admin will not receive feedback notifications.');
    }
    if (resend && fromAddress && adminEmail) {
      emailResult = await sendEmail({
        from: fromAddress,
        to: adminEmail,
        subject: 'New Feedback Received',
        html: emailWrapper(`
          <h2>New Feedback Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Website:</strong> ${website || 'N/A'}</p>
          <p><strong>Rating:</strong> ${rating}/5</p>
          <p><strong>Feedback:</strong></p>
          <p>${feedback}</p>
          ${image ? `<p><strong>Image:</strong> <a href="${image}">View Image</a></p>` : ''}
        `)
      });
      if (!emailResult.success) {
        console.error('Resend Feedback Email failed after retries.', emailResult.error);
      }
      // Send confirmation email to user
      userEmailResult = await sendEmail({
        from: fromAddress,
        to: email,
        subject: 'Thank you for your feedback - Websites Arena',
        html: emailWrapper(`
          <h2>Thank you for your feedback!</h2>
          <p>Dear ${name},</p>
          <p>We appreciate you taking the time to share your experience with us.</p>
          <p>Your feedback helps us improve our services.</p>
          <br>
          <p>Best regards,</p>
          <p>Websites Arena Team</p>
        `)
      });
      if (!userEmailResult.success) {
        console.error('Resend Feedback User Email failed after retries.', userEmailResult.error);
      }
    }
    res.status(201).json({ 
      success: true,
      message: 'Feedback submitted successfully',
      data: feedbackDoc,
      emailSent: emailResult.success,
      emailError: emailResult.success ? undefined : (emailResult.error?.message || emailResult.error),
      userEmailSent: userEmailResult.success,
      userEmailError: userEmailResult.success ? undefined : (userEmailResult.error?.message || userEmailResult.error)
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to submit feedback' 
    });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const query = req.query.admin === 'true' ? {} : { isApproved: true };
    const feedbacks = await Feedback.find(query).sort('-createdAt');
    res.json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Message Routes
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Create message in database
    const newMessage = await Message.create({
      name,
      email,
      phone,
      message
    });

    // Send notification email to admin
    let adminEmailResult = { success: false };
    let userEmailResult = { success: false };
    const fromAddress = getResendFromAddress();
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail || typeof adminEmail !== 'string' || !adminEmail.includes('@')) {
      console.warn('ADMIN_EMAIL is not set or invalid in environment variables. Admin will not receive message notifications.');
    }
    if (resend && fromAddress && adminEmail) {
      adminEmailResult = await sendEmail({
        from: fromAddress,
        to: adminEmail,
        subject: 'New Contact Message Received',
        html: emailWrapper(`
          <h2>New Message from Contact Form</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `)
      });
      if (!adminEmailResult.success) {
        console.error('Resend Message Admin Email failed after retries.', adminEmailResult.error);
      }
      userEmailResult = await sendEmail({
        from: fromAddress,
        to: email,
        subject: 'Message Received - Websites Arena',
        html: emailWrapper(`
          <h2>Thank you for contacting us!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p>Your message:</p>
          <p><em>${message}</em></p>
          <br>
          <p>Best regards,</p>
          <p>Websites Arena Team</p>
        `)
      });
      if (!userEmailResult.success) {
        console.error('Resend Message User Email failed after retries.', userEmailResult.error);
      }
    }
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully',
      data: newMessage,
      adminEmailSent: adminEmailResult.success,
      adminEmailError: adminEmailResult.success ? undefined : (adminEmailResult.error?.message || adminEmailResult.error),
      userEmailSent: userEmailResult.success,
      userEmailError: userEmailResult.success ? undefined : (userEmailResult.error?.message || userEmailResult.error)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Admin route to get all messages
app.get('/api/messages', async (req, res) => { // Temporarily removed auth
  try {
    const messages = await Message.find().sort('-createdAt');
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update message status
app.patch('/api/messages/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Email notification removed
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add DELETE endpoint for messages
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Unversioned aliases for messages (safe, non-breaking)
// These mirror the /api/v1/messages endpoints so older frontend code calling /api/messages will work.
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort('-createdAt');
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.patch('/api/messages/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Booking/Contact Routes
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, email, phone, service, requirements } = req.body;
    
    if (!name || !email || !requirements) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    let savedData;
    let dataType;

    // Route to appropriate collection based on service
    if (!service || service === 'General Inquiry') {
      // Save as message
      savedData = await Message.create({
        name,
        email,
        phone: phone || '',
        message: requirements,
        status: 'unread'
      });
      dataType = 'message';
    } else {
      // Save as booking
      savedData = await Booking.create({
        name,
        email,
        phone: phone || '',
        service,
        description: requirements,
        status: 'pending'
      });
      dataType = 'booking';
    }

    // Send confirmation email
    let emailSentSuccessfully = false;
    let adminEmailResult = { success: false };
    const fromAddress = getResendFromAddress();
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail || typeof adminEmail !== 'string' || !adminEmail.includes('@')) {
      console.warn('ADMIN_EMAIL is not set or invalid in environment variables. Admin will not receive booking notifications.');
    }
    try {
      if (!resend || !fromAddress) {
        throw new Error('Email service or sender address is not properly initialized');
      }
      // Send confirmation email to user
      const emailResponse = await resend.emails.send({
        headers: {
          'X-Entity-Ref-ID': new Date().getTime().toString(),
        },
        from: fromAddress,
        to: email,
        subject: `${dataType === 'booking' ? 'Booking' : 'Message'} Received - Websites Arena`,
        html: emailWrapper(`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3B82F6;">Thank you for reaching out!</h2>
            <p>Dear ${name},</p>
            <p>We've received your ${dataType} and appreciate you taking the time to contact us.</p>
            <p><strong>Your Details:</strong></p>
            <ul>
              <li>Name: ${name}</li>
              <li>Email: ${email}</li>
              ${phone ? `<li>Phone: ${phone}</li>` : ''}
              ${service ? `<li>Service Interest: ${service}</li>` : ''}
            </ul>
            <p><strong>Your Message:</strong></p>
            <p style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">${requirements}</p>
            <p>Our team will review your ${dataType} and get back to you ASAP!.</p>
            <br>
            <p>Best regards,</p>
            <p><strong>Websites Arena Team</strong></p>
          </div>
        `)
      });
      if (!emailResponse || !emailResponse.id) {
        throw new Error('No email response received from Resend');
      }
      emailSentSuccessfully = true;
      // Send admin notification
      if (adminEmail) {
        adminEmailResult = await sendEmail({
          from: fromAddress,
          to: adminEmail,
          subject: `New ${dataType === 'booking' ? 'Booking' : 'Message'} Received`,
          html: emailWrapper(`
            <h2>New ${dataType === 'booking' ? 'Booking' : 'Message'} Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
            <p><strong>Message/Requirements:</strong></p>
            <p>${requirements}</p>
          `)
        });
        if (!adminEmailResult.success) {
          console.error('Resend Booking Admin Email failed after retries.', adminEmailResult.error);
        }
      }
    } catch (emailError) {
      console.error('Email Error Details:', {
        error: emailError.message,
        stack: emailError.stack,
        name: emailError.name,
        code: emailError.code,
        response: emailError.response?.data
      });
      emailSentSuccessfully = false;
    }
    res.status(201).json({ 
      success: true, 
      data: savedData,
      type: dataType,
      emailSent: emailSentSuccessfully,
      adminEmailSent: adminEmailResult.success,
      adminEmailError: adminEmailResult.success ? undefined : (adminEmailResult.error?.message || adminEmailResult.error),
      message: emailSentSuccessfully 
        ? `${dataType} created and confirmation email sent successfully`
        : `${dataType} created but there was an issue sending the confirmation email`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort('-createdAt');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle feedback approval
app.post('/api/feedback/:id/approve', async (req, res) => {
  try {
    const { isApproved } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    // Send email notification about feedback status
    let emailResult = { success: false };
    const fromAddress = getResendFromAddress();
    if (resend && isApproved && fromAddress) {
      emailResult = await sendEmail({
        from: fromAddress,
        to: feedback.email,
        subject: `Feedback Approved - Websites Arena`,
        html: emailWrapper(`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3B82F6;">Feedback Status Update</h2>
            <p>Dear ${feedback.name},</p>
            <p>Thank you for your feedback! it keeps us motivated to improve our services.</p>
            <p><strong>Your Feedback:</strong></p>
            <p style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">${feedback.feedback}</p>
            <p>Rating: ${feedback.rating}/5</p>
            <p>Thank you for your valuable feedback! It is now visible on our website.</p>
            <br>
            <p>Best regards,</p>
            <p><strong>Websites Arena Team</strong></p>
          </div>
        `)
      });
      if (!emailResult.success) {
        console.error('Resend Feedback Approval Email failed after retries.', emailResult.error);
      }
    }
    res.json({ success: true, data: feedback, emailSent: emailResult.success, emailError: emailResult.success ? undefined : (emailResult.error?.message || emailResult.error) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete routes for projects, feedback, and bookings
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete an email log by ID
app.delete('/api/email/logs/:id', async (req, res) => {
  try {
    const log = await EmailLog.findByIdAndDelete(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, message: 'Email log not found' });
    }
    res.json({ success: true, message: 'Email log deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all email logs
app.get('/api/email/logs', async (req, res) => {
  try {
    const logs = await EmailLog.find()
      .sort('-sentAt')
      .limit(100); // Limit to last 100 logs for performance
    
    console.log('Fetched email logs:', logs); // Add logging
    
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching email logs:', error); // Add error logging
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch email logs'
    });
  }
});

// Admin Analytics Routes
app.get('/api/admin/analytics', async (req, res) => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.setMonth(today.getMonth() - 1));

    const [
      totalProjects,
      totalFeedbacks,
      totalBookings,
      recentBookings,
      pendingFeedbacks,
      projectStats
    ] = await Promise.all([
      Project.countDocuments(),
      Feedback.countDocuments(),
      Booking.countDocuments(),
      Booking.find({ createdAt: { $gte: lastMonth } }).count(),
      Feedback.find({ isApproved: false }).count(),
      Project.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalProjects,
        totalFeedbacks,
        totalBookings,
        recentBookings,
        pendingFeedbacks,
        projectStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Bulk Actions
app.post('/api/admin/bulk-delete', async (req, res) => {
  try {
    const { type, ids } = req.body;
    let Model;
    switch (type) {
      case 'projects':
        Model = Project;
        break;
      case 'feedback':
        Model = Feedback;
        break;
      case 'bookings':
        Model = Booking;
        break;
      default:
        throw new Error('Invalid type specified');
    }

    await Model.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: 'Items deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Booking Status
app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Email notification removed
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update attended status for a booking
app.patch('/api/bookings/:id/attended', async (req, res) => {
  try {
    const { attended } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { attended },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Search and Filter
app.get('/api/search', async (req, res) => {
  try {
    const { type, query, status, startDate, endDate } = req.query;
    let Model;
    const filter = {};

    // Add date range if provided
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Add status filter if provided
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Add search query if provided
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    switch (type) {
      case 'projects':
        Model = Project;
        break;
      case 'feedback':
        Model = Feedback;
        break;
      case 'bookings':
        Model = Booking;
        break;
      default:
        throw new Error('Invalid type specified');
    }

    const results = await Model.find(filter).sort('-createdAt');
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a project by ID
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { title, description, category, technologies, liveUrl, githubUrl, imageUrl } = req.body;
    const update = {
      title,
      description,
      category,
      technologies: Array.isArray(technologies) ? technologies : (typeof technologies === 'string' ? technologies.split(',').map(t => t.trim()) : []),
      liveUrl,
      githubUrl,
      imageUrl
    };
    const project = await Project.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Real Health Integrations ---

// UptimeRobot Uptime Endpoint
app.get('/api/health/uptime', async (req, res) => {
  try {
    const apiKey = process.env.UPTIMEROBOT_API_KEY;
    const monitorId = process.env.UPTIMEROBOT_MONITOR_ID;
    if (!apiKey || !monitorId) {
      return res.status(500).json({ success: false, message: 'UptimeRobot API key or Monitor ID not set in .env' });
    }
    const response = await axios.post('https://api.uptimerobot.com/v2/getMonitors', {
      api_key: apiKey,
      monitors: monitorId,
      custom_uptime_ranges: '30',
      format: 'json'
    });
    const monitor = response.data.monitors[0];
    // UptimeRobot returns uptime ratio for the last 30 days as a string
    const uptimeHistory = monitor.custom_uptime_ranges.split('-').map((val, i) => ({ day: `Day ${i+1}`, uptime: parseFloat(val) }));
    res.json({ success: true, data: uptimeHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Google PageSpeed Insights Performance/SEO/A11y/Best Practices
app.get('/api/health/performance', async (req, res) => {
  try {
    const url = process.env.SITE_URL || 'https://websitesarena.com';
    const psi = await axios.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed', {
      params: {
        url,
        strategy: 'desktop'
      }
    });
    const lhr = psi.data.lighthouseResult;
    res.json({
      success: true,
      data: [
        { name: 'Performance', score: Math.round(lhr.categories.performance.score * 100) },
        { name: 'Accessibility', score: Math.round(lhr.categories.accessibility.score * 100) },
        { name: 'Best Practices', score: Math.round(lhr.categories['best-practices'].score * 100) },
        { name: 'SEO', score: Math.round(lhr.categories.seo.score * 100) }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// SSL Labs SSL Health Endpoint
app.get('/api/health/ssl', async (req, res) => {
  try {
    const url = process.env.SITE_URL || 'websitesarena.com';
    const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const ssl = await axios.get('https://api.ssllabs.com/api/v3/analyze', {
      params: { host }
    });
    const endpoint = ssl.data.endpoints && ssl.data.endpoints[0];
    let daysLeft = null;
    let status = 'unknown';
    let suggestion = 'Check SSL details.';
    if (endpoint && endpoint.details && endpoint.details.cert) {
      const validTo = endpoint.details.cert.notAfter;
      const now = Date.now() / 1000;
      daysLeft = Math.round((validTo - now) / 86400);
      status = daysLeft > 14 ? 'good' : 'warn';
      suggestion = daysLeft > 14 ? 'SSL valid.' : 'Renew SSL soon!';
    }
    res.json({ success: true, data: { daysLeft, status, suggestion } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle specific error types
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File is too large. Maximum size is 5MB.' 
      });
    }
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate key error',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ 
    success: false, 
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Email Analytics Route
app.get('/api/email/analytics', async (req, res) => {
  try {
    const [
      totalEmails,
      failedEmails,
      emailsByType,
      recentEmails,
      topRecipients
    ] = await Promise.all([
      EmailLog.countDocuments(),
      EmailLog.countDocuments({ status: 'failed' }),
      EmailLog.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      EmailLog.find()
        .sort('-sentAt')
        .limit(10)
        .select('to subject type status sentAt'),
      EmailLog.aggregate([
        { $group: { 
          _id: '$to', 
          count: { $sum: 1 },
          successCount: { 
            $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] }
          }
        }},
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalEmails,
        failedEmails,
        emailsByType,
        recentEmails,
        topRecipients,
        successRate: ((totalEmails - failedEmails) / totalEmails * 100).toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health API Endpoints
// NOTE: A production UptimeRobot-backed /api/health/uptime handler exists earlier
// in this file. Removing the local mock duplicate prevents route shadowing.
// If you want a development-only mock, add a conditional around it (NODE_ENV === 'development').

app.get('/api/health/errors', async (req, res) => {
  // TODO: Integrate with real error log/monitoring
  res.json({ success: true, data: Array.from({ length: 12 }, (_, i) => ({ month: `M${i+1}`, errors: Math.floor(Math.random()*10) })) });
});

app.get('/api/health/security', async (req, res) => {
  // TODO: Integrate with real security scanner
  res.json({ success: true, data: [
    { name: 'Vulnerabilities', value: 0, status: 'good', suggestion: 'No known vulnerabilities.' },
    { name: 'Security Headers', value: 'All Set', status: 'good', suggestion: 'All recommended headers present.' }
  ] });
});

app.get('/api/health/performance', async (req, res) => {
  // TODO: Integrate with Lighthouse/PageSpeed
  res.json({ success: true, data: [
    { name: 'Performance', score: 72 },
    { name: 'Accessibility', score: 88 },
    { name: 'Best Practices', score: 90 },
    { name: 'SEO', score: 85 }
  ] });
});

app.get('/api/health/links', async (req, res) => {
  // TODO: Integrate with link checker
  res.json({ success: true, data: [
    { url: '/old-page', type: 'internal' },
    { url: 'https://external.com/broken', type: 'external' }
  ] });
});

app.get('/api/health/ssl', async (req, res) => {
  // TODO: Integrate with SSL Labs or similar
  res.json({ success: true, data: { daysLeft: 45, status: 'good', suggestion: 'SSL valid.' } });
});

app.get('/api/health/dns', async (req, res) => {
  // TODO: Integrate with DNS monitoring
  res.json({ success: true, data: { daysLeft: 120, status: 'good', suggestion: 'DNS valid.' } });
});

// Analytics API Endpoints (real aggregations from Visit collection)

// Helper: simple UA parsing for device/browser classification
function classifyDevice(userAgent) {
  if (!userAgent) return 'Unknown';
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(ua)) return 'Tablet';
  if (/mobi|iphone|android|ipod|phone/.test(ua)) return 'Mobile';
  return 'Desktop';
}

function detectBrowser(userAgent) {
  if (!userAgent) return 'Unknown';
  const ua = userAgent;
  if (/Edg\//.test(ua)) return 'Edge';
  if (/OPR\//.test(ua) || /Opera\//.test(ua)) return 'Opera';
  if (/Chrome\//.test(ua) && !/Chromium\//.test(ua)) return 'Chrome';
  if (/CriOS\//.test(ua)) return 'Chrome';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua) && !/Chromium\//.test(ua)) return 'Safari';
  return 'Other';
}

// Record a visit. Frontend should POST visitorId, path, referrer (optional).
app.post('/api/visits', async (req, res) => {
  try {
    const { visitorId, path, referrer, userAgent } = req.body || {};
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.connection?.remoteAddress || '';
    await Visit.create({ visitorId, path: path || req.path, referrer: referrer || req.get('referer') || '', userAgent: userAgent || req.get('user-agent') || '', ip });
    res.json({ success: true });
  } catch (error) {
    console.error('Visit logging error:', error);
    res.status(500).json({ success: false, message: 'Failed to record visit' });
  }
});

// Overview: unique daily reach for the last N days (default 7)
app.get('/api/analytics/overview', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));

    const pipeline = [
      { $match: { createdAt: { $gte: start } } },
      { $project: { day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, visitorKey: { $ifNull: ['$visitorId', '$ip'] } } },
      { $group: { _id: '$day', uniqueVisitors: { $addToSet: '$visitorKey' } } },
      { $project: { day: '$_id', reach: { $size: '$uniqueVisitors' } } },
      { $sort: { day: 1 } }
    ];

    const rows = await Visit.aggregate(pipeline);

    // Ensure we return an entry for each day in range (even 0s)
    const map = new Map(rows.map(r => [r.day, r.reach]));
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toISOString().slice(0, 10);
      result.push({ label, reach: map.get(label) || 0 });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Overview analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Pages: top pages by views and unique visitors
app.get('/api/analytics/pages', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const pipeline = [
      { $project: { path: 1, visitorKey: { $ifNull: ['$visitorId', '$ip'] } } },
      { $group: { _id: '$path', views: { $sum: 1 }, visitors: { $addToSet: '$visitorKey' } } },
      { $project: { page: '$_id', views: 1, uniqueVisitors: { $size: '$visitors' } } },
      { $sort: { views: -1 } },
      { $limit: limit }
    ];
    const rows = await Visit.aggregate(pipeline);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Pages analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Devices: breakdown by Mobile/Desktop/Tablet (by hits)
app.get('/api/analytics/devices', async (req, res) => {
  try {
    const rows = await Visit.find().select('userAgent').lean();
    const counts = { Mobile: 0, Desktop: 0, Tablet: 0, Unknown: 0 };
    rows.forEach(r => counts[classifyDevice(r.userAgent) || 'Unknown']++);
    const data = Object.entries(counts).map(([type, users]) => ({ type, users }));
    res.json({ success: true, data });
  } catch (error) {
    console.error('Devices analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Browsers: simple classification
app.get('/api/analytics/browsers', async (req, res) => {
  try {
    const rows = await Visit.find().select('userAgent').lean();
    const counts = {};
    rows.forEach(r => {
      const b = detectBrowser(r.userAgent);
      counts[b] = (counts[b] || 0) + 1;
    });
    const data = Object.entries(counts).map(([name, users]) => ({ name, users })).sort((a, b) => b.users - a.users);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Browsers analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Sources: Direct, Search, Social, Referral
app.get('/api/analytics/sources', async (req, res) => {
  try {
    const rows = await Visit.find().select('referrer').lean();
    const counts = { Direct: 0, Search: 0, Social: 0, Referral: 0, Other: 0 };
    const searchEngines = [/google\./i, /bing\./i, /yahoo\./i, /duckduckgo\./i];
    const socialHosts = [/facebook\./i, /twitter\./i, /t\.co/i, /instagram\./i, /linkedin\./i, /pinterest\./i];
    rows.forEach(r => {
      const ref = r.referrer || '';
      if (!ref) { counts.Direct++; return; }
      if (searchEngines.some(re => re.test(ref))) { counts.Search++; return; }
      if (socialHosts.some(re => re.test(ref))) { counts.Social++; return; }
      counts.Referral++;
    });
    const data = Object.entries(counts).map(([source, value]) => ({ source, value }));
    res.json({ success: true, data });
  } catch (error) {
    console.error('Sources analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Engagement: simple metrics computed from visits
app.get('/api/analytics/engagement', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));

    // total views
    const totalViews = await Visit.countDocuments({ createdAt: { $gte: start } });

    // unique visitors
    const uniqueVisitors = await Visit.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: { $ifNull: ['$visitorId', '$ip'] } } },
      { $count: 'count' }
    ]);
    const visitorsCount = (uniqueVisitors[0] && uniqueVisitors[0].count) || 0;

    // pages per visitor (approx)
    const pagesPerVisitor = visitorsCount ? +(totalViews / visitorsCount).toFixed(2) : 0;

    // bounce: percent of visitors with only 1 hit in period
    const bounceAgg = await Visit.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: { $ifNull: ['$visitorId', '$ip'] }, hits: { $sum: 1 } } },
      { $group: { _id: null, singlePageVisitors: { $sum: { $cond: [{ $eq: ['$hits', 1] }, 1, 0] } }, totalVisitors: { $sum: 1 } } }
    ]);
    const bounceData = (bounceAgg[0] && bounceAgg[0].totalVisitors) ? Math.round((bounceAgg[0].singlePageVisitors / bounceAgg[0].totalVisitors) * 100) : 0;

    res.json({ success: true, data: { bounce: bounceData, pagesPerVisitor, uniqueVisitors: visitorsCount, totalViews } });
  } catch (error) {
    console.error('Engagement analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// MongoDB Atlas connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'websitesarena',
  })
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    // Ensure indexes for analytics performance
    try {
      // create single-field indexes and a compound index helpful for aggregations
      await Visit.collection.createIndex({ createdAt: 1 });
      await Visit.collection.createIndex({ path: 1 });
      await Visit.collection.createIndex({ visitorId: 1 });
      await Visit.collection.createIndex({ visitorId: 1, createdAt: 1 });
      console.log('Visit collection indexes ensured');
    } catch (idxErr) {
      console.warn('Failed to create Visit indexes:', idxErr.message || idxErr);
    }

    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Atlas connection error:', err);
  });

// --- Careers Application Endpoint ---
const careersUploadDir = path.join(__dirname, 'public', 'uploads', 'careers');
if (!fs.existsSync(careersUploadDir)) fs.mkdirSync(careersUploadDir, { recursive: true });
const careersUpload = multer({
  dest: careersUploadDir,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  }
});

app.post('/api/careers', careersUpload.single('cv'), async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    let cvUrl = '';
    if (req.file) {
      cvUrl = `/uploads/careers/${req.file.filename}`;
    }
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }
    const application = await CareerApplication.create({ name, email, phone, message, cvUrl });
    // Build absolute CV link
    const siteUrl = process.env.SITE_URL || 'api.websitesraena.com';
    const cvLink = cvUrl ? `${siteUrl}${cvUrl}` : '';
    // Send confirmation email
    let emailResult = { success: false };
    let adminEmailResult = { success: false };
    const fromAddress = getResendFromAddress();
    const adminEmail = process.env.ADMIN_EMAIL;
    if (resend && fromAddress) {
      // Send confirmation to user
      emailResult = await sendEmail({
        from: fromAddress,
        to: email,
        subject: 'Application Received - Websites Arena',
        html: emailWrapper(`
          <h2>Thank you for your application!</h2>
          <p>Dear ${name},</p>
          <p>We have received your application and will review it soon. If there is a match, we will contact you for next steps.</p>
          <br>
          <p>Best regards,</p>
          <p>Websites Arena Team</p>
        `)
      });
      if (!emailResult.success) {
        console.error('Resend Careers Email failed after retries.', emailResult.error);
      }
      // Send admin notification
      if (adminEmail) {
        adminEmailResult = await sendEmail({
          from: fromAddress,
          to: adminEmail,
          subject: 'New Career Application Received',
          html: emailWrapper(`
            <h2>New Career Application</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            ${cvLink ? `<p><strong>CV:</strong> <a href="${cvLink}">Download CV</a></p>` : ''}
          `)
        });
        if (!adminEmailResult.success) {
          console.error('Resend Careers Admin Email failed after retries.', adminEmailResult.error);
        }
      }
    }
    res.status(201).json({ success: true, message: 'Application submitted successfully', emailSent: emailResult.success, emailError: emailResult.success ? undefined : (emailResult.error?.message || emailResult.error), adminEmailSent: adminEmailResult.success, adminEmailError: adminEmailResult.success ? undefined : (adminEmailResult.error?.message || adminEmailResult.error) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Careers Application Endpoint ---
app.get('/api/careers', async (req, res) => {
  try {
    const careers = await CareerApplication.find().sort('-createdAt');
    res.json({ success: true, data: careers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add these new career endpoints
app.delete('/api/careers/:id', async (req, res) => {
  try {
    const career = await CareerApplication.findByIdAndDelete(req.params.id);
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career application not found' });
    }
    // Delete CV file if exists
    if (career.cvUrl) {
      const filePath = path.join(__dirname, 'public', career.cvUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.json({ success: true, message: 'Career application deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/careers/:id', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const career = await CareerApplication.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, message },
      { new: true }
    );
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career application not found' });
    }
    res.json({ success: true, data: career });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Developer CRUD API ---
// Create developer
app.post('/api/developers', async (req, res) => {
  try {
    const { name, email, phone, paymentDetails, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }
    const existing = await Developer.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Developer with this email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const developer = await Developer.create({
      name,
      email: email.trim().toLowerCase(),
      phone,
      paymentDetails,
      password: hashedPassword
    });
    const { password: _, ...devData } = developer.toObject();
    res.status(201).json({ success: true, data: devData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all developers
app.get('/api/developers', async (req, res) => {
  try {
    const developers = await Developer.find().sort('-createdAt').select('-password');
    res.json({ success: true, data: developers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single developer
app.get('/api/developers/:id', async (req, res) => {
  try {
    const developer = await Developer.findById(req.params.id).select('-password');
    if (!developer) return res.status(404).json({ success: false, message: 'Developer not found' });
    res.json({ success: true, data: developer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update developer
app.put('/api/developers/:id', async (req, res) => {
  try {
    const { name, email, phone, paymentDetails, password } = req.body;
    const update = { name, email: email?.trim().toLowerCase(), phone, paymentDetails };
    if (typeof password === 'string' && password.trim() !== '') {
      update.password = await bcrypt.hash(password, 10);
    }
    const developer = await Developer.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    if (!developer) return res.status(404).json({ success: false, message: 'Developer not found' });
    res.json({ success: true, data: developer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete developer
app.delete('/api/developers/:id', async (req, res) => {
  try {
    const developer = await Developer.findByIdAndDelete(req.params.id);
    if (!developer) return res.status(404).json({ success: false, message: 'Developer not found' });
    res.json({ success: true, message: 'Developer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Developer Sign In Endpoint ---
app.post('/api/developers/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }
  try {
    const normalized = String(email).trim().toLowerCase();

    // Admin special case: if this exact email & password are provided, trigger email verification
    const ADMIN_EMAIL = (process.env.ADMIN_OVERRIDE_EMAIL || 'thomasmwanziamatheri@gmail.com').trim().toLowerCase();
    const ADMIN_PASSWORD = process.env.ADMIN_OVERRIDE_PASSWORD || 'Founder254@Wa';

    if (normalized === ADMIN_EMAIL && String(password) === ADMIN_PASSWORD) {
      // Create a short-lived verification code and send to admin email
      // Reuse the Verification model used for client signup (it exists below in the file)
      try {
        // Remove any old verification for this email
        await Verification.deleteMany({ email: normalized }).catch(() => {});

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const codeHash = await bcrypt.hash(code, 10);
        const passwordHash = await bcrypt.hash(String(password), 10);
        const expiresAt = new Date(Date.now() + (15 * 60 * 1000)); // 15 minutes

        const ver = await Verification.create({ name: 'Admin', email: normalized, passwordHash, codeHash, expiresAt });

        const fromAddress = getResendFromAddress();
        if (!resend || !fromAddress) {
          await Verification.deleteOne({ _id: ver._id }).catch(() => {});
          return res.status(500).json({ success: false, message: 'Email service not configured. Please try again later.' });
        }

        await sendEmail({
          from: fromAddress,
          to: normalized,
          subject: 'Admin sign-in verification code - Websites Arena',
          html: emailWrapper(`
            <h2>Admin sign-in verification</h2>
            <p>A sign-in attempt to the admin dashboard was made. Enter the following 6-digit code to continue.</p>
            <h1 style="letter-spacing:6px; font-size:28px;">${code}</h1>
            <p>This code expires in 15 minutes.</p>
          `),
          type: 'notification'
        }).catch(async (err) => {
          console.error('Failed to send admin verification email', err);
          await Verification.deleteOne({ _id: ver._id }).catch(() => {});
          throw err;
        });

        // Inform client that a verification code was sent and further verification is required
        return res.json({ success: true, adminPending: true, message: 'Verification code sent to admin email' });
      } catch (err) {
        console.error('Admin verification flow error:', err);
        return res.status(500).json({ success: false, message: 'Failed to initiate admin verification' });
      }
    }

    // Non-admin developers: normal developer auth
    const dev = await Developer.findOne({ email: normalized });
    if (!dev) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    const valid = await bcrypt.compare(password, dev.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    // Generate JWT token for developer
    const token = jwt.sign(
      { _id: dev._id, email: dev.email, role: 'developer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    // Optionally, include developer id/email/name in response for frontend convenience
    return res.json({ success: true, token, developer: { _id: dev._id, email: dev.email, name: dev.name } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Admin verification endpoint (verify code sent to admin email) ---
app.post('/api/developers/verify-admin', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ success: false, message: 'Email and code are required' });
    const normalized = String(email).trim().toLowerCase();
    const ver = await Verification.findOne({ email: normalized });
    if (!ver) return res.status(400).json({ success: false, message: 'No verification request found for this email' });
    if (ver.expiresAt < new Date()) {
      await Verification.deleteOne({ _id: ver._id }).catch(() => {});
      return res.status(400).json({ success: false, message: 'Verification code expired' });
    }
    const match = await bcrypt.compare(String(code), ver.codeHash);
    if (!match) {
      ver.attempts = (ver.attempts || 0) + 1;
      await ver.save();
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    // Create or update admin user in User collection
    let user = await User.findOne({ email: normalized });
    if (!user) {
      // create admin user
      user = await User.create({ name: 'Admin', email: normalized, password: ver.passwordHash, role: 'admin' });
    } else {
      if (user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }
    }

    // Remove verification record
    await Verification.deleteOne({ _id: ver._id }).catch(() => {});

    // Issue JWT token for admin
    const token = jwt.sign({ _id: user._id, email: user.email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to verify admin code' });
  }
});

// --- Client Sign Up ---
app.post('/api/clients/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    const normalized = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalized });
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: normalized, password: hashed, role: 'user' });
    // return created user (without password)
    const safe = { _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
    res.status(201).json({ success: true, data: safe });
  } catch (error) {
    console.error('Client signup error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Email Verification Temporary Schema ---
const verificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Verification = mongoose.model('Verification', verificationSchema);

// Helper: password strength validator
function isStrongPassword(pw) {
  if (!pw || typeof pw !== 'string') return false;
  // at least 8 chars, upper, lower, number, special
  return /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(pw);
}

// Request verification: create a temp verification entry and send 6-digit code
app.post('/api/clients/request-verification', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    const normalized = String(email).trim().toLowerCase();
    if (!isStrongPassword(password)) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters and include uppercase, lowercase, number and special character.' });

    // Prevent existing user
    const existing = await User.findOne({ email: normalized });
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });

    // Remove any old verification for this email
    await Verification.deleteMany({ email: normalized });

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const codeHash = await bcrypt.hash(code, 10);
    const passwordHash = await bcrypt.hash(password, 10);
    const expiresAt = new Date(Date.now() + (15 * 60 * 1000)); // 15 minutes

    const ver = await Verification.create({ name: name.trim(), email: normalized, passwordHash, codeHash, expiresAt });

    // Send verification email (use Resend directly and fail fast on error so client knows)
    const fromAddress = getResendFromAddress();
    if (!resend || !fromAddress) {
      // Clean up the verification entry to avoid dangling records
      await Verification.deleteOne({ _id: ver._id }).catch(() => {});
      console.error('Email service or FROM address not configured for verification emails');
      return res.status(500).json({ success: false, message: 'Email service not configured. Please try again later.' });
    }

    try {
      const emailResponse = await resend.emails.send({
        headers: { 'X-Entity-Ref-ID': Date.now().toString() },
        from: fromAddress,
        to: normalized,
        subject: 'Verify your email - Websites Arena',
        html: emailWrapper(`
          <h2>Please verify your email</h2>
          <p>Hi ${name.trim()},</p>
          <p>Use the following 6-digit code to verify your email address. This code expires in 15 minutes.</p>
          <h1 style="letter-spacing:6px; font-size:28px;">${code}</h1>
          <p>If you did not request this, you can safely ignore this email.</p>
        `)
      });

      if (!emailResponse || !emailResponse.id) {
        // Sending failed — clean up and inform client
        await Verification.deleteOne({ _id: ver._id }).catch(() => {});
        console.error('Verification email send returned no id:', emailResponse);
        return res.status(500).json({ success: false, message: 'Failed to send verification email. Please try again.' });
      }

      // Log success and respond
      console.log('Verification email queued:', emailResponse.id);
      res.status(200).json({ success: true, message: 'Verification code sent to email' });
    } catch (emailErr) {
      // Remove created verification to avoid orphaned records and return error
      await Verification.deleteOne({ _id: ver._id }).catch(() => {});
      console.error('Verification email sending failed:', emailErr);
      const extra = emailErr?.response?.data ? ` | response: ${JSON.stringify(emailErr.response.data)}` : '';
      return res.status(500).json({ success: false, message: 'Failed to send verification email' + extra });
    }
  } catch (error) {
    console.error('Request verification error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to request verification' });
  }
});

// Verify code and create user
app.post('/api/clients/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ success: false, message: 'Email and code are required' });
    const normalized = String(email).trim().toLowerCase();
    const ver = await Verification.findOne({ email: normalized });
    if (!ver) return res.status(400).json({ success: false, message: 'No verification request found for this email' });
    if (ver.expiresAt < new Date()) {
      await Verification.deleteOne({ _id: ver._id });
      return res.status(400).json({ success: false, message: 'Verification code expired' });
    }
    const match = await bcrypt.compare(String(code), ver.codeHash);
    if (!match) {
      ver.attempts = (ver.attempts || 0) + 1;
      await ver.save();
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    // Create user
    const existing = await User.findOne({ email: normalized });
    if (existing) {
      await Verification.deleteOne({ _id: ver._id });
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name: ver.name, email: normalized, password: ver.passwordHash, role: 'user' });
    await Verification.deleteOne({ _id: ver._id });

    const safe = { _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
    res.json({ success: true, message: 'Email verified and account created', data: safe });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to verify code' });
  }
});

// --- Client Sign In ---
app.post('/api/clients/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
    const user = await User.findOne({ email: email.trim().toLowerCase(), role: 'user' });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ _id: user._id, email: user.email, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Client signin error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Get all clients (users with role 'user') ---
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await User.find({ role: 'user' }).select('-password').sort('-createdAt');
    res.json({ success: true, data: clients });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single client
app.get('/api/clients/:id', async (req, res) => {
  try {
    const client = await User.findById(req.params.id).select('-password');
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, data: client });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update client (admin)
app.put('/api/clients/:id', async (req, res) => {
  try {
    const { name, email, phone, company, password } = req.body;
    const update = { name, phone, company };
    if (email) update.email = email.trim().toLowerCase();
    if (password && String(password).trim() !== '') {
      update.password = await bcrypt.hash(password, 10);
    }
    const client = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, data: client });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete client
// Request account deletion verification code
app.post('/api/clients/request-deletion', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    
    // Save code hash and expiry to user document
    user.deleteVerifyCode = codeHash;
    user.deleteVerifyExpires = new Date(Date.now() + (15 * 60 * 1000)); // 15 minutes
    await user.save();
    
    // Send verification email for deletion request (use Resend directly for clearer errors)
    const fromAddress = getResendFromAddress();
    if (!resend || !fromAddress) {
      console.error('Email service or FROM address not configured for deletion emails');
      return res.status(500).json({ success: false, message: 'Email service not configured. Please try again later.' });
    }

    try {
      const emailResponse = await resend.emails.send({
        headers: { 'X-Entity-Ref-ID': Date.now().toString() },
        from: fromAddress,
        to: user.email,
        subject: 'Account Deletion Request - Websites Arena',
        html: emailWrapper(`
          <h2>Account Deletion Request</h2>
          <p>Hi ${user.name},</p>
          <p>We received a request to delete your Websites Arena account. To proceed, use this verification code:</p>
          <h1 style="letter-spacing:6px; font-size:28px;">${code}</h1>
          <p>This code will expire in 15 minutes.</p>
          <p>If you did not request this, please secure your account by changing your password immediately.</p>
        `)
      });

      if (!emailResponse || !emailResponse.id) {
        console.error('Deletion verification email send returned no id:', emailResponse);
        return res.status(500).json({ success: false, message: 'Failed to send deletion code. Please try again.' });
      }

      res.json({ success: true, message: 'Deletion code sent to your email' });
    } catch (emailError) {
      console.error('Request deletion code email error:', emailError);
      const extra = emailError?.response?.data ? ` | response: ${JSON.stringify(emailError.response.data)}` : '';
      return res.status(500).json({ success: false, message: 'Failed to send deletion code' + extra });
    }
  } catch (error) {
    console.error('Request deletion code error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify deletion code and delete account
app.post('/api/clients/verify-deletion', auth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Verification code required' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.deleteVerifyCode || !user.deleteVerifyExpires) {
      return res.status(400).json({ success: false, message: 'No deletion request found' });
    }

    if (user.deleteVerifyExpires < new Date()) {
      // Clear expired code
      user.deleteVerifyCode = undefined;
      user.deleteVerifyExpires = undefined;
      await user.save();
      return res.status(400).json({ success: false, message: 'Verification code expired' });
    }

    const match = await bcrypt.compare(String(code), user.deleteVerifyCode);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    // Delete the account
    await User.findByIdAndDelete(user._id);

    // Send confirmation email
    const fromAddress = getResendFromAddress();
    if (resend && fromAddress) {
      try {
        await sendEmail({
          from: fromAddress,
          to: user.email,
          subject: 'Account Deleted - Websites Arena',
          html: emailWrapper(`
            <h2>Account Deleted Successfully</h2>
            <p>Hi ${user.name},</p>
            <p>Your Websites Arena account has been successfully deleted.</p>
            <p>We're sorry to see you go. If you change your mind, you can create a new account anytime.</p>
            <p>Best regards,</p>
            <p>Websites Arena Team</p>
          `),
          type: 'notification'
        });
      } catch (emailError) {
        console.error('Account deletion confirmation email failed:', emailError);
      }
    }

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Verify deletion code error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin delete client
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const client = await User.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Current authenticated user endpoints (for client profile)
app.get('/api/users/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/me', auth, async (req, res) => {
  try {
    const { name, email, phone, company, password } = req.body;
    const update = { name, phone, company };
    if (email) update.email = email.trim().toLowerCase();
    if (password && String(password).trim() !== '') update.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Update current user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
// Get developer by email
// Add this route with your other developer routes in backend
app.get('/api/developers/name/:email', async (req, res) => {
  try {
    // Accept email either as a path param or query param to be flexible from frontend
    const raw = req.params.email || req.query.email;
    if (!raw) return res.status(400).json({ success: false, message: 'Email required' });

    // Decode in case frontend doesn't encode special chars, normalize for lookup
    const email = decodeURIComponent(String(raw || '')).trim().toLowerCase();
    console.log('Fetching developer name for email:', email);

    // Case-insensitive exact match using regex to handle minor casing/encoding differences
    const developer = await Developer.findOne({ email: { $regex: `^${email}$`, $options: 'i' } }).select('name email');

    // Instead of returning 404 (which breaks frontend flows), return success with null name
    // so UI can handle missing developers gracefully.
    if (!developer) {
      console.log('Developer not found for email:', email);
      return res.json({ success: true, data: { name: null, email } });
    }

    console.log('Found developer:', developer);
    res.json({ success: true, data: developer });
  } catch (error) {
    console.error('Error fetching developer name:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
// --- Activity CRUD API ---
// Create activity
app.post('/api/activities', async (req, res) => {
  try {
    const { title, description, type, status, priority, deadline } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required.' });
    const activity = await Activity.create({ title, description, type, status, priority, deadline });

    // Notify all registered developers about the new activity, queued at 1 email/sec.
    (async () => {
      try {
        const developers = await Developer.find().select('name email');
        if (developers && developers.length > 0) {
          const from = getResendFromAddress();
          const subject = `New Activity: ${title}`;
          const deadlineText = deadline ? `Deadline: ${new Date(deadline).toLocaleString()}` : 'No deadline specified';
          const content = `
            <h2 style="margin:0 0 8px">${title}</h2>
            <p style="margin:0 0 12px">${description || 'No description provided.'}</p>
            <p style="margin:0 0 6px"><strong>Type:</strong> ${type || 'N/A'}</p>
            <p style="margin:0 0 6px"><strong>Priority:</strong> ${priority || 'N/A'}</p>
            <p style="margin:0 0 6px"><strong>${deadlineText}</strong></p>
            <p style="margin-top:12px;font-size:13px;color:#cbd5e1;">You are receiving this because you are registered as a developer on Websites Arena.</p>
          `;

          // send emails sequentially with a 1 second delay between each send
          const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

          for (const dev of developers) {
            try {
              await sendEmail({
                from,
                to: dev.email,
                subject,
                html: emailWrapper(`<p>Hi ${dev.name || dev.email},</p>${content}`),
                type: 'notification'
              });
            } catch (err) {
              // sendEmail already logs failures to EmailLog; repeat a log here for extra visibility
              console.error(`Failed to send activity notification to ${dev.email}:`, err?.message || err);
            }

            // wait 1 second before sending the next email to respect the 1 email/sec requirement
            // Using await ensures strictly one send per second.
            await sleep(1000);
          }
        }
      } catch (notifyErr) {
        console.error('Failed to notify developers about new activity (queued):', notifyErr);
      }
    })();

    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all activities
app.get('/api/activities', async (req, res) => {
  try {
    const activities = await Activity.find().sort('-createdAt');
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single activity
app.get('/api/activities/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update activity
app.put('/api/activities/:id', async (req, res) => {
  try {
    const { title, description, type, status, priority, deadline } = req.body;
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { title, description, type, status, priority, deadline },
      { new: true }
    );
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete activity
app.delete('/api/activities/:id', async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Increment developersWorking
app.post('/api/activities/:id/working', async (req, res) => {
  try {
    const { developerId } = req.body || {};
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    if (developerId) {
      // Validate developer
      const dev = await Developer.findById(developerId).select('name email');
      if (!dev) return res.status(404).json({ success: false, message: 'Developer not found' });
      // Add to list if not already present
      const exists = activity.developersWorkingList && activity.developersWorkingList.some(id => id.toString() === developerId);
      if (!exists) {
        activity.developersWorkingList = activity.developersWorkingList || [];
        activity.developersWorkingList.push(dev._id);
      }
      // keep numeric counter in sync
      activity.developersWorking = (activity.developersWorkingList || []).length;
    } else {
      // backward-compatible increment
      activity.developersWorking = (activity.developersWorking || 0) + 1;
    }

    await activity.save();
    // Populate developer info when returning
    await activity.populate('developersWorkingList', 'name email phone');
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Decrement developersWorking (Not working on it)
app.post('/api/activities/:id/not-working', async (req, res) => {
  try {
    const { developerId } = req.body || {};
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    if (developerId) {
      activity.developersWorkingList = (activity.developersWorkingList || []).filter(id => id.toString() !== developerId);
      activity.developersWorking = (activity.developersWorkingList || []).length;
    } else {
      activity.developersWorking = Math.max(0, (activity.developersWorking || 0) - 1);
      // also try to trim list if list exists and numeric went below list length
      if (activity.developersWorkingList && activity.developersWorking < activity.developersWorkingList.length) {
        activity.developersWorkingList = activity.developersWorkingList.slice(0, activity.developersWorking);
      }
    }

    await activity.save();
    await activity.populate('developersWorkingList', 'name email phone');
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get developers for an activity
app.get('/api/activities/:id/developers', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('developersWorkingList', 'name email phone');
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, data: activity.developersWorkingList || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a developer to activity
app.post('/api/activities/:id/developers', async (req, res) => {
  try {
    const { developerId } = req.body;
    if (!developerId) return res.status(400).json({ success: false, message: 'developerId is required' });
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    const dev = await Developer.findById(developerId).select('name email phone');
    if (!dev) return res.status(404).json({ success: false, message: 'Developer not found' });
    activity.developersWorkingList = activity.developersWorkingList || [];
    if (!activity.developersWorkingList.some(id => id.toString() === developerId)) {
      activity.developersWorkingList.push(dev._id);
    }
    activity.developersWorking = activity.developersWorkingList.length;
    await activity.save();
    await activity.populate('developersWorkingList', 'name email phone');
    res.json({ success: true, data: activity.developersWorkingList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove a developer from activity
app.delete('/api/activities/:id/developers/:devId', async (req, res) => {
  try {
    const { id, devId } = req.params;
    const activity = await Activity.findById(id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    activity.developersWorkingList = (activity.developersWorkingList || []).filter(d => d.toString() !== devId);
    activity.developersWorking = (activity.developersWorkingList || []).length;
    await activity.save();
    await activity.populate('developersWorkingList', 'name email phone');
    res.json({ success: true, data: activity.developersWorkingList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Helper: Robust Email Sending with Logging and Structure Validation ---
async function sendEmail({ from, to, subject, html, headers, type = 'notification' }, maxRetries = 3, delayMs = 1000) {
  // Validate required fields
  if (!from || typeof from !== 'string' || !from.includes('@')) {
    throw new Error('Invalid from address');
  }
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    throw new Error('Invalid to address');
  }
  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    throw new Error('Invalid subject');
  }
  if (!html || typeof html !== 'string' || !html.trim()) {
    throw new Error('Invalid html content');
  }
  if (!resend) {
    throw new Error('Email service not initialized');
  }

  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await resend.emails.send({
        from,
        to,
        subject,
        html,
        headers
      });

      // Create email log entry after successful send
      try {
        const emailLog = await EmailLog.create({
          to,
          subject,
          type,
          status: 'sent',
          sentAt: new Date()
        });
        console.log('Email log created:', emailLog);
      } catch (logError) {
        console.error('Failed to create email log:', logError);
      }

      return { success: true, data: result };
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        continue;
      }
    }
  }

  // Create failed email log entry
  try {
    // include additional response details when available to aid debugging
    const extra = lastError?.response?.data ? ` | response: ${JSON.stringify(lastError.response.data)}` : '';
    const errorMsg = (lastError?.message || 'Unknown error') + extra;
    const emailLog = await EmailLog.create({
      to,
      subject,
      type,
      status: 'failed',
      error: errorMsg,
      sentAt: new Date()
    });
    console.log('Failed email log created:', emailLog);
    // Log full error object for debugging (stack and response) without changing send flow
    try {
      console.error('sendEmail final error:', lastError);
      if (lastError?.response?.data) console.error('sendEmail response data:', JSON.stringify(lastError.response.data));
    } catch (logErr) {
      console.error('Error logging sendEmail error details:', logErr);
    }
  } catch (logError) {
    console.error('Failed to create email log:', logError);
  }

  return { success: false, error: lastError };
}

// Helper to get the verified sender address from env
function getResendFromAddress() {
  const email = process.env.RESEND_FROM_EMAIL;
  const name = process.env.RESEND_FROM_NAME || '';
  if (!email) {
    console.error('RESEND_FROM_EMAIL is not set in environment variables.');
    return null;
  }
  return name ? `${name} <${email}>` : email;
}



function emailWrapper(content) {
  return `
  <div style="padding:40px 0;display:flex;align-items:flex-start;justify-content:center;min-height:100vh;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#1e293b;border-radius:18px;box-shadow:0 6px 20px rgba(0,0,0,0.25);overflow:hidden;">
      
      <!-- HEADER -->
      <tr>
        <td style="padding:32px 36px 20px 36px;text-align:left;">
          <span style="font-family:'Cinzel','Playfair Display','Georgia','Times New Roman',serif;
                       font-size:36px;font-weight:700;color:#2563eb;letter-spacing:1px;">
            Websites
          </span>
          <span style="font-family:'Cinzel','Playfair Display','Georgia','Times New Roman',serif;
                       font-size:36px;font-weight:700;color:#000000;letter-spacing:1px;margin-left:6px;display:inline-block;position:relative;">
            Arena
            <span style="display:block;height:3px;width:100%;background:#2563eb;border-radius:2px;margin-top:4px;"></span>
          </span>
        </td>
      </tr>

      <!-- MAIN CONTENT -->
      <tr>
        <td style="padding:0 36px 40px 36px;">
          <div style="background:#f1f5f9;padding:24px;border-radius:12px;
                      font-family:'Segoe UI',Arial,sans-serif;color:#000000;
                      font-size:16px;line-height:1.6;text-align:left;">
            ${content}
          </div>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#0f172a;color:#ffffff;font-size:13px;text-align:left;
                   padding:20px 36px;border-top:1px solid #1e293b;letter-spacing:0.02em;">
          <span style="font-weight:600;">Websites Arena</span> — Empowering Your Digital Presence<br/>
          <span style="display:inline-block;margin-top:6px;">&copy; ${new Date().getFullYear()} All rights reserved.</span>
        </td>
      </tr>

    </table>
  </div>
  `;
}

// POST /api/email/send
// Accepts multipart/form-data with fields: to, subject, content and files under 'attachments'
// Uses existing sendEmail helper and logs via EmailLog (already handled inside sendEmail)
const emailsUploadDir = path.join(__dirname, 'public', 'uploads', 'emails');
if (!fs.existsSync(emailsUploadDir)) fs.mkdirSync(emailsUploadDir, { recursive: true });
const emailsUpload = multer({
  dest: emailsUploadDir,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
});

app.post('/api/email/send', emailsUpload.array('attachments'), async (req, res) => {
  try {
    const { to, subject, content } = req.body || {};
    if (!to || !subject || !content) {
      return res.status(400).json({ success: false, message: 'to, subject and content are required' });
    }

    // Build attachment links (publicly served via /uploads)
    const files = req.files || [];
    const siteUrl = (process.env.SITE_URL || '').replace(/\/$/, '');
    const attachmentLinks = files.map(f => ({
      filename: f.originalname,
      url: `${siteUrl || ''}/uploads/emails/${f.filename}`
    }));

    // Append attachments section to content so admin can see them in the email
    const attachmentsHtml = attachmentLinks.length ? `
      <hr/>
      <h4>Attachments</h4>
      <ul>
        ${attachmentLinks.map(a => `<li><a href="${a.url}">${a.filename}</a></li>`).join('')}
      </ul>
    ` : '';

    const html = emailWrapper(`${content}${attachmentsHtml}`);

    const fromAddress = getResendFromAddress();
    if (!resend || !fromAddress) {
      return res.status(500).json({ success: false, message: 'Email service not configured' });
    }

    const sendResult = await sendEmail({
      from: fromAddress,
      to,
      subject,
      html,
      type: 'notification'
    });

    if (!sendResult.success) {
      return res.status(500).json({ success: false, message: sendResult.error?.message || 'Failed to send email', error: String(sendResult.error) });
    }

    // Return attachment links and resend response id if available
    res.json({ success: true, message: 'Email sent', data: { attachments: attachmentLinks, resend: sendResult.data } });
  } catch (error) {
    console.error('Email send endpoint error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send email' });
  }
});

 // --- Developer Password Test Endpoint ---
app.post('/api/developers/test-password', async (req, res) => {
  const { email, password } = req.body;
  const dev = await Developer.findOne({ email });
  if (!dev) return res.json({ found: false });
  const valid = await bcrypt.compare(password, dev.password);
  res.json({ found: true, valid });
});

app.post('/api/developers/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email and new password are required.' });
  }
  try {
    // Trim and lowercase email for matching
    const dev = await Developer.findOne({ email: email.trim().toLowerCase() });
    if (!dev) {
      // Try fallback: find by case-insensitive regex
      const fallbackDev = await Developer.findOne({ email: { $regex: `^${email.trim()}$`, $options: 'i' } });
      if (!fallbackDev) {
        return res.status(404).json({ success: false, message: 'Developer not found' });
      }
      fallbackDev.password = await bcrypt.hash(newPassword, 10);
      await fallbackDev.save();
      return res.json({ success: true, message: 'Password updated' });
    }
    dev.password = await bcrypt.hash(newPassword, 10);
    await dev.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update password' });
  }
});

// --- Teams API ---
// Get all teams
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await Team.find().sort('-createdAt');
    // Sort messages and replies
    teams.forEach(team => {
      team.messages = (team.messages || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      team.messages.forEach(msg => {
        msg.replies = (msg.replies || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      });
    });
    res.json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Enhanced team creation
app.post('/api/teams', async (req, res) => {
  try {
    const { name, rank, techStacks, bio, avatarUrl, contactEmail, whatsappGroup } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }
    
    const team = await Team.create({
      name,
      rank,
      techStacks: Array.isArray(techStacks) ? techStacks : 
                 String(techStacks || '').split(',').map(t => t.trim()).filter(Boolean),
      bio,
      avatarUrl,
      contactEmail,
      whatsappGroup,
      members: [],
      messages: [] // Ensure messages array is properly initialized
    });

    res.status(201).json({ success: true, data: team });
  } catch (error) {
    console.error('Team creation error:', error);
    
    // Handle duplicate team names
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Team name already exists' 
      });
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update team
app.put('/api/teams/:id', async (req, res) => {
  try {
    const { name, rank, techStacks, bio, avatarUrl, contactEmail, whatsappGroup } = req.body;
    const update = {
      name,
      rank,
      techStacks: Array.isArray(techStacks) ? techStacks : String(techStacks || '').split(',').map(t => t.trim()).filter(Boolean),
      bio,
      avatarUrl,
      contactEmail,
      whatsappGroup  // Make sure this is included
    };
    const team = await Team.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete team
app.delete('/api/teams/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    res.json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Join team
app.post('/api/teams/:id/join', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    const normalizedEmail = email.trim().toLowerCase();
    if (!team.members.includes(normalizedEmail)) {
      team.members.push(normalizedEmail);
      await team.save();
    }
    res.json({ success: true, data: team });



  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Leave team
app.post('/api/teams/:id/leave', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    const normalizedEmail = email.trim().toLowerCase();
    team.members = team.members.filter(e => e !== normalizedEmail);
    await team.save();
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// Post message to team - FIXED VERSION
app.post('/api/teams/:id/messages', async (req, res) => {
  try {
    const { author, text, email } = req.body;
    if (!author || !text || !email) {
      return res.status(400).json({ success: false, message: 'Author, text, and email required' });
    }
    
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }
    
    // Enhanced member verification
    const normalizedEmail = email.trim().toLowerCase();
    const isMember = team.members.includes(normalizedEmail);
    const isAdmin = author === 'Admin'; // Or use proper admin verification
    
    if (!isAdmin && !isMember) {
      return res.status(403).json({ 
        success: false, 
        message: 'You must be a team member to post messages.' 
      });
    }
    
    team.messages.push({ 
      author, 
      text, 
      email: normalizedEmail,
      readBy: [normalizedEmail],
      createdAt: new Date()
    });
    
    await team.save();
    res.json({ success: true, data: team });
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
// Edit message
app.put('/api/teams/:id/messages/:messageId', async (req, res) => {
  try {
    const { text, author, email } = req.body;
    if (!text || !author || !email) return res.status(400).json({ success: false, message: 'Text, author, and email required' });
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    const msg = team.messages.id(req.params.messageId);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    // Only allow edit within 1 minute and by author/email
    const withinMinute = Date.now() - new Date(msg.createdAt).getTime() <= 60 * 1000;
    if (!withinMinute || msg.email !== email.trim().toLowerCase()) {
      return res.status(403).json({ success: false, message: 'You can only edit your own message within 1 minute.' });
    }
    msg.text = text;
    msg.author = author;
    await team.save();
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete message
app.delete('/api/teams/:id/messages/:messageId', async (req, res) => {
  try {
    const { author, email } = req.body || req.query;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    const msg = team.messages.id(req.params.messageId);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    // Only allow delete within 1 minute and by author/email, or admin
    const withinMinute = Date.now() - new Date(msg.createdAt).getTime() <= 60 * 1000;
    const isAdmin = req.query.admin === 'true';
    if (!isAdmin && (!withinMinute || msg.email !== (email || '').trim().toLowerCase())) {
      return res.status(403).json({ success: false, message: 'You can only delete your own message within 1 minute.' });
    }
    if (isAdmin) {
      // Remove using array filter for admin
      team.messages = team.messages.filter(m => m._id.toString() !== req.params.messageId);
    } else {
      // Remove using subdocument .remove() for author within 1 minute
      msg.remove();
    }
    await team.save();
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reply to message
app.post('/api/teams/:id/messages/:messageId/replies', async (req, res) => {
  try {
    const { author, text, email } = req.body;
    if (!author || !text || !email) return res.status(400).json({ success: false, message: 'Author, text, and email required' });
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    const msg = team.messages.id(req.params.messageId);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    msg.replies.push({ 
      author, 
      text, 
      email: email.trim().toLowerCase(),
      readBy: [email.trim().toLowerCase()] // Initialize with sender
    });
    await team.save();
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark team message as read
app.post('/api/teams/:id/messages/read', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });
    
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    
    const normalizedEmail = email.trim().toLowerCase();
    
    // Only allow marking messages as read if user is team member
    if (!team.members.includes(normalizedEmail)) {
      return res.status(403).json({ success: false, message: 'Must be team member' });
    }
    
    // Mark all messages and replies as read
    team.messages.forEach(msg => {
      if (!msg.readBy) msg.readBy = [];
      if (!msg.readBy.includes(normalizedEmail)) {
        msg.readBy.push(normalizedEmail);
      }
      msg.replies?.forEach(reply => {
        if (!reply.readBy) reply.readBy = [];
        if (!reply.readBy.includes(normalizedEmail)) {
          reply.readBy.push(normalizedEmail);
        }
      });
    });
    
    await team.save();
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update chat message schema to include admin read status
const chatMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  readAt: { type: Date },
  adminRead: { type: Boolean, default: false }, // Add this field
  adminReadAt: { type: Date }, // Add this field
  deleted: { type: Boolean, default: false },
  edited: { type: Boolean, default: false },
  editHistory: [{
    message: String,
    editedAt: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// Chat routes
app.post('/api/chats/send', async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const chat = new ChatMessage({ sender, receiver, message });
    await chat.save();
    res.json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/chats/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const messages = await ChatMessage.find({
      $or: [
        { sender: email, receiver: 'admin', deleted: false },
        { sender: 'admin', receiver: email, deleted: false }
      ]
    }).sort('createdAt');
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/chats/unread/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { isAdmin } = req.query;

    const query = isAdmin === 'true' ?
      { receiver: 'admin', adminRead: false, deleted: false } :
      { receiver: email, read: false, deleted: false };

    const count = await ChatMessage.countDocuments(query);
    res.json({ success: true, data: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.patch('/api/chats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const chat = await ChatMessage.findById(id);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    
    // Save edit history
    chat.editHistory.push({
      message: chat.message,
      editedAt: new Date()
    });
    
    chat.message = message;
    chat.edited = true;
    await chat.save();
    
    res.json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/chats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await ChatMessage.findById(id);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    
    chat.deleted = true;
    await chat.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark single message as read
app.patch('/api/chats/:id/read', async (req, res) => {
  try {
    const { isAdmin } = req.query;
    const updateData = isAdmin === 'true' ? 
      { adminRead: true, adminReadAt: new Date() } :
      { read: true, readAt: new Date() };
    
    const message = await ChatMessage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Get updated unread count
    const unreadQuery = isAdmin === 'true' ?
      { sender: message.sender, adminRead: false, deleted: false } :
      { receiver: message.receiver, read: false, deleted: false };
    
    const unreadCount = await ChatMessage.countDocuments(unreadQuery);

    res.json({ 
      success: true, 
      data: message,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add endpoint to get admin unread counts
app.get('/api/chats/admin/unread', async (req, res) => {
  try {
    const unreadCounts = await ChatMessage.aggregate([
      {
        $match: {
          receiver: 'admin',
          adminRead: false,  // Use adminRead instead of read
          deleted: false
        }
      },
      {
        $group: {
          _id: '$sender',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({ success: true, data: unreadCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
