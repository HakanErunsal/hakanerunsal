"use client";

import React, { useState } from 'react';

interface ImageDialog {
  src: string;
  alt: string;
  className?: string;
}

const ImageDialog: React.FC<ImageDialog> = ({ src, alt, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDialog = () => {
    setIsOpen(!isOpen);
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
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={toggleDialog}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ImageDialog;
