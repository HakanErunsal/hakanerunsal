"use client";

import React, { useState, useRef, useEffect } from 'react';

interface VideoLoopProps {
  src: string;
  className?: string;
}

const VideoLoop: React.FC<VideoLoopProps> = ({ src, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullScreenVideoRef = useRef<HTMLVideoElement>(null);

  const toggleDialog = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const isPaused = videoRef.current.paused;

      if (!isOpen) {
        setIsOpen(true);
        setTimeout(() => setIsVisible(true),10); // Trigger fade-in after opening
      } else {
        setIsVisible(false);
        setTimeout(() => {
          setIsOpen(false);
          if (videoRef.current) {
            videoRef.current.currentTime = currentTime;
            if (!isPaused) {
              videoRef.current.play();
            }
          }
        }, 500); // Match duration of the fade-out
      }

      setTimeout(() => {
        if (fullScreenVideoRef.current && isOpen) {
          fullScreenVideoRef.current.currentTime = currentTime;
          if (!isPaused) {
            fullScreenVideoRef.current.play();
          }
        }
      }, 0);
    }
  };

  useEffect(() => {
    if (fullScreenVideoRef.current && isOpen) {
      const currentTime = videoRef.current?.currentTime || 0;
      const isPaused = videoRef.current?.paused || false;

      fullScreenVideoRef.current.currentTime = currentTime;
      if (!isPaused) {
        fullScreenVideoRef.current.play();
      }
    }
  }, [isOpen]);

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        className={`cursor-pointer ${className}`}
        autoPlay
        loop
        muted
        playsInline
        onClick={toggleDialog}
      />
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleDialog}
        >
          <video
            ref={fullScreenVideoRef}
            src={src}
            className="max-w-full max-h-full transform transition-transform duration-500 cursor-pointer"
            autoPlay
            loop
            muted
            playsInline
            onClick={(e) => {
              e.stopPropagation();
              toggleDialog();
            }}
          />
        </div>
      )}
    </>
  );
};

export default VideoLoop;
