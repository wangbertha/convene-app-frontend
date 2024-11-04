import React, { useRef, useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import '../styles/ProfileCard.css';

export default function ProfileCard({ profile, onSwipe }) {
  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleSwipe = (direction) => {
    const distance = direction === 'right' ? 1000 : -1000;
    api.start({
      x: distance,
      onRest: () => {
        onSwipe(direction);
        api.set({ x: 0 });
      }
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    api.set({ x: dx });
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const dx = e.clientX - startX;

    if (dx > 100) {
      handleSwipe('right');
    } else if (dx < -100) {
      handleSwipe('left');
    } else {
      api.start({ x: 0 });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      handleSwipe('right');
    } else if (e.key === 'ArrowLeft') {
      handleSwipe('left');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <animated.div
      className="profile-card"
      ref={cardRef}
      style={{ x }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => isDragging && handleMouseUp()}
    >
      <img src={profile.image} alt="Profile" className="profile-image" />
      <div className="profile-info">
        <h3>{profile.name}</h3>
        <p>{profile.bio}</p>
        <p>Age: {profile.age}</p>
      </div>
    </animated.div>
  );
}
