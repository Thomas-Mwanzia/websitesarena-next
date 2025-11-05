'use client';

import { color, motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaPray, FaHeart } from 'react-icons/fa';

export default function StoryOfHope() {
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    testimony: '',
    prayerRequest: '',
    acceptedDate: new Date().toISOString().split('T')[0]
  });
  const [submitted, setSubmitted] = useState(false);

  const getYoutubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : url.split('si=')[0].split('?')[0].split('/').pop();
  };

  const VideoContainer = ({ link, title }) => (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      <div className="aspect-video bg-gray-800 rounded-lg">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${getYoutubeId(link)}?rel=0`}
          onLoad={() => setIsLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>
    </div>
  );

  const videos = [
    {
      title: "Understanding the Gospel",
      link: 'https://youtu.be/NUB4I5vO12o?si=5SIqrB0jS46gHUiS'
    },
    {
      title: "The Problem of Sin",
      link: 'https://www.youtube.com/live/shLMIx_hiRA?si=ml340yUMKlJlMfWT'
    },
    {
      title: "Jesus: The Only Way",
      link: 'https://youtu.be/OGo9Y1SeOtU?si=bBmYsh-j2mQ-a2-U'
    },
    {
      title: "How to Receive Salvation",
      link: 'https://youtu.be/sH59j8qfJAI?si=AVvTwZIGO6JL7jbB'
    },
    {
      title: "True Biblical Salvation",
      link: 'https://youtu.be/y7g7qlgdL_8?si=cx8ZiUIQw6LWmBAK' // Using same as above since no link was provided
    },
    {
      title: "Following Christ",
      link: 'https://youtu.be/DsPaeE9d7Ek?si=9Mkg5yoC_A8gdf-h'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy submission - replace with actual backend call
    console.log('Prayer request submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setFormData({
        name: '',
        country: '',
        testimony: '',
        prayerRequest: '',
        acceptedDate: new Date().toISOString().split('T')[0]
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-2 py-10">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-400 mb-4 text-center">Salvation In Jesus Christ</h1>
        
        {/* Introduction Video */}
        <VideoContainer {...videos[0]} />

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-green-300 mb-2">Our Need for Saving</h2>
          <p className="text-gray-200 mb-2">
            The Bible teaches that all people have sinned and are separated from God. Sin is anything we do, say, or think that goes against God's perfect standard.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic mb-2">
            "For all have sinned and fall short of the glory of God." (Romans 3:23)
          </blockquote>
          <p className="text-gray-200">
            The result of sin is spiritual death—eternal separation from God.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic">
            "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord." (Romans 6:23)
          </blockquote>
        </section>

        {/* Sin Explanation Video */}
        <VideoContainer {...videos[1]} />

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-green-300 mb-2">Jesus Christ</h2>
                    <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic mb-2">
            "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us." (Romans 5:8)
          </blockquote>
          <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic">
            "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." (John 3:16)
          </blockquote>
          <br />
          <p className="text-gray-200 mb-2">
            God loves us so much that He provided a way to restore our relationship with Him. He sent His Son, Jesus Christ, to live a perfect life, die on the cross for our sins <span style={{ color: 'gray' }}>
  (the death that belonged to us because of our wrong doings)
</span>
, and rise again<span style={{ color: 'gray' }}>
  (Conqured death and sin on our behalf so that when we believe in Him for saving, we can have eternal life)
</span>. <br />
          </p>

        </section>

        {/* Jesus as Savior Video */}
        <VideoContainer {...videos[2]} />

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-green-300 mb-2">Receive the Gift</h2>
          <p className="text-gray-200 mb-2">
            Salvation is a free gift. We cannot earn it by good works or religious rituals. We receive it by faith—trusting in Jesus Christ alone for forgiveness and new life.
          </p>
          <ul className="list-disc pl-6 text-gray-300 mb-2 space-y-1">
            <li>
              <span className="font-semibold text-yellow-300">Repent:</span> Turn away from sin and turn to God.
            </li>
            <li>
              <span className="font-semibold text-yellow-300">Believe:</span> Trust that Jesus died and rose again for you.
            </li>
            <li>
              <span className="font-semibold text-yellow-300">Confess:</span> Declare Jesus as Lord of your life.
            </li>
          </ul>
          <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic mb-2">
            "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved." (Romans 10:9)
          </blockquote>
          <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic">
            "For everyone who calls on the name of the Lord will be saved." (Romans 10:13)
          </blockquote>
        </section>

        {/* Salvation Message Video */}
        <VideoContainer {...videos[3]} />
        {/* True Salvation Video */}
        <VideoContainer {...videos[4]} />
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-green-300 mb-2">4. A Simple Prayer of Salvation</h2>
          <p className="text-gray-200 mb-2">
            If you want to receive Jesus as your Savior, you can pray a simple prayer like this:
          </p>
          <div className="bg-blue-900/60 rounded-lg p-4 mb-2 text-blue-100">
"Lord Jesus, I confess that I am a sinner in need of Your forgiveness. I believe that You died on the cross for my sins and rose again to give me new life. I turn away from my sin and invite You into my heart and life. I trust You as my Lord and Savior. Help me to grow, to become the person You created me to be. Teach me to love You, to love others, and to love myself. Thank You for saving me. Amen."</div>
          <p className="text-gray-400 text-sm">
            If you prayed this prayer, welcome to God's family! Find a Bible-believing church, read God's Word, and grow in your new faith.
          </p>
        </section>



        <section>
          <h2 className="text-xl font-semibold text-green-300 mb-2">5. Assurance and Next Steps</h2>
          <p className="text-gray-200 mb-2">
            God promises eternal life to all who trust in Jesus. You can have assurance of your salvation because it is based on God's promise, not your feelings.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic mb-2">
            "I write these things to you who believe in the name of the Son of God so that you may know that you have eternal life." (1 John 5:13)
          </blockquote>
          <ul className="list-disc pl-6 text-gray-300 space-y-1">
            <li>Read the Bible daily to know God more.</li>
            <li>Pray and talk to God regularly.</li>
            <li>Connect with other believers for encouragement and growth.</li>
            <li>Share your story of hope with others!</li>
          </ul>
        </section>

        {/* Discipleship Video */}
        <VideoContainer {...videos[5]} />

        <p className="text-gray-400 text-center mt-8">
          <span className="italic">"Therefore, if anyone is in Christ, he is a new creation; the old has gone, the new is here!" (2 Corinthians 5:17)</span>
        </p>

        {/* New Prayer Request Section */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-center text-blue-400 mb-6">
              Click if you have received Jesus Christ as your Lord and Savior Today!
            </h2>
            
            {!showForm ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="mx-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
              >
                <FaPray className="text-xl" />
                <span>I have accepted Christ Today</span>
                <FaHeart className="text-red-400 animate-pulse" />
              </motion.button>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto space-y-4"
                onSubmit={handleSubmit}
              >
                <div className="space-y-2">
                  <label className="text-gray-300 block">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-gray-300 block">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 block">Brief Testimony (Optional)</label>
                  <textarea
                    value={formData.testimony}
                    onChange={(e) => setFormData({ ...formData, testimony: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows="3"
                    placeholder="Say Hi to your new family in Christ"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 block">Prayer Request (Optional)</label>
                  <textarea
                    value={formData.prayerRequest}
                    onChange={(e) => setFormData({ ...formData, prayerRequest: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows="2"
                    placeholder="We would like to include you in our prayers"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}

            {submitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-green-600/20 border border-green-500 rounded-lg text-green-400 text-center"
              >
                Thank you for sharing! We're rejoicing with you and will be praying for you! 🎉
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
