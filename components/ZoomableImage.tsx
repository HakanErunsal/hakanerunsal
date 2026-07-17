"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';

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

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-[100] transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleDialog}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-[95vw] max-h-[95vh] transform transition-transform duration-200"
            onClick={toggleDialog}
          />
        </div>,
        document.body
      )}
    </div>
  );
};

export default ZoomableImage;
