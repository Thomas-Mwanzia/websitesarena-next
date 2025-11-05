import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiCode, FiLayout, FiStar } from 'react-icons/fi';

const InteractiveShowcase = () => {
  const [selectedDemo, setSelectedDemo] = useState(null);
  const containerRef = useRef(null);
  
  const demos = [
    {
      id: 'portfolio',
      title: 'Portfolio Website',
      description: 'Modern & Interactive Portfolio Website',
      color: '#3B82F6',
      features: ['Dynamic Hero Section', '3D Project Cards', 'Animated Skills Graph'],
      image: '/assets/illustrations/portfolio-showcase.svg'
    },
    {
      id: 'blog',
      title: 'Blog Platform',
      description: 'Professional Blogging Platform',
      color: '#8B5CF6',
      features: ['Rich Text Editor', 'Comment System', 'Categories'],
      image: '/assets/illustrations/blog-showcase.svg'
    },
    {
      id: 'business',
      title: 'Business Suite',
      description: 'Professional Business Platform',
      color: '#10B981',
      features: ['Analytics Dashboard', 'Client Portal', 'Booking System'],
      image: '/assets/illustrations/business-showcase.svg'
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce',
      description: 'Feature-rich Online Store',
      color: '#F59E0B',
      features: ['Product Showcase', 'Shopping Cart', 'Payment Integration'],
      image: '/assets/illustrations/ecommerce-showcase.svg'
    },
    {
      id: 'restaurant',
      title: 'Restaurant Website',
      description: 'Interactive Restaurant Platform',
      color: '#EF4444',
      features: ['Menu Display', 'Reservation System', 'Online Ordering'],
      image: '/assets/illustrations/restaurant-showcase.svg'
    },
    {
      id: 'realestate',
      title: 'Real Estate Platform',
      description: 'Property Listing & Management',
      color: '#14B8A6',
      features: ['Property Search', 'Virtual Tours', 'Agent Portal'],
      image: '/assets/illustrations/realestate-showcase.svg'
    }
  ];

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    const cards = document.querySelectorAll('.demo-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardX = (rect.left + rect.width / 2 - e.clientX) / -30;
      const cardY = (rect.top + rect.height / 2 - e.clientY) / -30;
      
      card.style.transform = `
        perspective(1000px)
        rotateY(${cardX}deg)
        rotateX(${cardY}deg)
        translateZ(20px)
      `;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {demos.map((demo) => (
          <motion.div
            key={demo.id}
            layoutId={demo.id}
            onClick={() => setSelectedDemo(demo)}
            className="demo-card relative group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
              <div
              className="relative h-80 rounded-2xl p-8 flex flex-col justify-end overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${demo.color}22, ${demo.color}44, ${demo.color}11)`
              }}
            >
              <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${demo.color}22 0%, transparent 50%)`
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">{demo.title}</h3>
                <p className="text-gray-300">{demo.description}</p>
              </div>              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-2">
                  <FiPlus className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setSelectedDemo(null)}
          >
            <motion.div
              layoutId={selectedDemo.id}
              className="bg-gray-800 rounded-3xl p-8 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-white">{selectedDemo.title}</h2>
                <button
                  onClick={() => setSelectedDemo(null)}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-900 relative group">
                  <img
                    src={selectedDemo.image}
                    alt={selectedDemo.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-300">{selectedDemo.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedDemo.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-gray-400"
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: selectedDemo.color }}
                        />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    className="px-6 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    onClick={() => setSelectedDemo(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveShowcase;