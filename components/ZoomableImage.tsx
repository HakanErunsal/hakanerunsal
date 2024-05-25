"use client";

import React, { useState } from 'react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleDialog = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => setIsVisible(true), 10); // Trigger fade-in after opening
    } else {
      setIsVisible(false);
      setTimeout(() => setIsOpen(false), 150); // Match duration of the fade-out
    }
  };

  return (
    <div>
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer ${className}`}
        onClick={toggleDialog}
      />

      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleDialog}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full transform transition-transform duration-200"
            onClick={toggleDialog}
          />
        </div>
      )}
    </div>
  );
};

export default ZoomableImage;
