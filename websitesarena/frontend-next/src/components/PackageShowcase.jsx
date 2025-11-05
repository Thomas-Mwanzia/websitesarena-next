import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { packageIllustrations } from '../../../frontend/src/data/packageIllustrations';

const PackageShowcase = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
      
      <motion.div
        ref={ref}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {packageIllustrations.map((item, index) => (
          <motion.div
            key={item.id}
            variants={{
              hidden: { y: 50, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className={`relative group rounded-2xl overflow-hidden bg-gradient-radial ${item.gradient}`}
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.alt}
                className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                loading={index > 5 ? "lazy" : "eager"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {item.alt}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-900/50 to-gray-900" />
      </div>
    </div>
  );
};

export default PackageShowcase;