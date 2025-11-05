import { useEffect, useRef } from 'react';

export const usePortfolioInteractions = (containerId) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 3D Tilt Effect
    const handleMouseMove = (e) => {
      const cards = container.getElementsByClassName('project-card');
      Array.from(cards).forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale3d(1.05, 1.05, 1.05)
        `;
      });
    };

    // Parallax Effect
    const handleScroll = () => {
      const particles = container.getElementsByClassName('particle');
      const scrolled = window.scrollY;
      
      Array.from(particles).forEach((particle, index) => {
        const speed = index % 2 === 0 ? 0.2 : 0.4;
        particle.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    // Interactive Skill Bars
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skillBars = entry.target.getElementsByClassName('skill-bar');
          Array.from(skillBars).forEach(bar => {
            bar.style.animation = 'fillBar 2s ease forwards';
          });
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5
    });

    observer.observe(container);
    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [containerId]);

  return containerRef;
};

export default usePortfolioInteractions;