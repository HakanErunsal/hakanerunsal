"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface VideoLoopProps {
  src: string;
  className?: string;
  title?: string;
}

const VideoLoop: React.FC<VideoLoopProps> = ({ src, className, title = "The Last Line | Official Gameplay Trailer" }) => {
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
        setTimeout(() => setIsVisible(true), 10); // Trigger fade-in after opening
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
        title={title}
        aria-label={title}
        autoPlay
        loop
        muted
        playsInline
        onClick={toggleDialog}
      />
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-[100] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleDialog}
        >
          <video
            ref={fullScreenVideoRef}
            src={src}
            className="max-w-full max-h-full transform transition-transform duration-500 cursor-pointer"
            title={title}
            aria-label={title}
            autoPlay
            loop
            playsInline
            onClick={(e) => {
              e.stopPropagation();
              toggleDialog();
            }}
            muted={false} // Ensure sound is on when in fullscreen
          />
        </div>,
        document.body
      )}
    </>
  );
};

export default VideoLoop;
