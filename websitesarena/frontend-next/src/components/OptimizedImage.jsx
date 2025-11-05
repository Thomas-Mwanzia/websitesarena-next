import React, { useState, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  blur = true,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!priority) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: '50px'
        }
      );

      observer.observe(document.getElementById(`image-${src}`));
      return () => observer.disconnect();
    } else {
      setIsInView(true);
    }
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const generateSrcSet = () => {
    const sizes = [320, 480, 640, 768, 1024, 1280];
    return sizes
      .map(size => `${src}?width=${size} ${size}w`)
      .join(', ');
  };

  return (
    <div
      id={`image-${src}`}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {(isInView || priority) && (
        <>
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`
              transition-opacity duration-300 ease-in-out
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
              ${className}
            `}
            loading={priority ? 'eager' : 'lazy'}
            srcSet={generateSrcSet()}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={handleLoad}
          />
          {blur && !isLoaded && (
            <div 
              className="absolute inset-0 backdrop-blur-sm bg-gray-200/20 animate-pulse"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </div>
  );
};

export default OptimizedImage;