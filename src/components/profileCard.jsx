import React, { useRef, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import '../styles/ProfileCard.css';

export default function ProfileCard({ profile, onSwipe }) {
  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  const cardRef = useRef(null);
  const [swiped, setSwiped] = useState(false);

  const handleSwipe = (direction) => {
    if (swiped) return;
    setSwiped(true);
    const distance = direction === 'right' ? 1000 : -1000;
    api.start({
      x: distance,
      onRest: () => {
        onSwipe(direction);
        api.set({ x: 0 });
        setSwiped(false);
      }
    });
  };

  const handleDrag = (event) => {
    const dragDistance = event.movementX;
    api.set({ x: dragDistance });
  };

  const handleDragEnd = (event) => {
    if (event.movementX > 100) handleSwipe('right');
    else if (event.movementX < -100) handleSwipe('left');
    else api.start({ x: 0 });
  };

  return (
    <animated.div
      className="profile-card"
      ref={cardRef}
      style={{ x }}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
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
