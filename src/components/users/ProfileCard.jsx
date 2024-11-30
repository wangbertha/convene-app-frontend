import { useRef, useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

import '../../styles/ProfileCard.css';

export default function ProfileCard({ profile, onSwipe }) {
  const [{ x }, api] = useSpring(() => ({ x: 0 })); // Animates horizontal swipe
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false); // Tracks drag state
  const [startX, setStartX] = useState(0); // Stores starting x-coordinate of the drag

  // Handle swipe logic
  const handleSwipe = (direction) => {
    const distance = direction === 'right' ? 1000 : -1000; // Move card off-screen
    api.start({
      x: distance,
      onRest: () => {
        onSwipe(direction); // Call parent onSwipe with direction
        api.set({ x: 0 }); // Reset position after swipe
      },
    });
  };

  // Handle mouse drag start
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX); // Set starting position
  };

  // Handle mouse drag move
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX; // Calculate drag distance
    api.set({ x: dx }); // Update position based on drag
  };

  // Handle mouse drag release
  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false); // End dragging
    const dx = e.clientX - startX;

    // Determine swipe direction or reset position
    if (dx > 100) {
      handleSwipe('right');
    } else if (dx < -100) {
      handleSwipe('left');
    } else {
      api.start({ x: 0 }); // Reset to center if drag is too small
    }
  };

  // Handle arrow key navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      handleSwipe('right');
    } else if (e.key === 'ArrowLeft') {
      handleSwipe('left');
    }
  };

  // Attach and detach keydown event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <animated.div
      className="profile-card"
      ref={cardRef}
      style={{ x }} // Bind animation to horizontal movement
      onMouseDown={handleMouseDown} // Start dragging
      onMouseMove={handleMouseMove} // Drag movement
      onMouseUp={handleMouseUp} // Release drag
      onMouseLeave={() => isDragging && handleMouseUp()} // Handle drag exit
    >
      <img src={profile.profilePicture} alt="Profile" className="profile-picture" />
      <div className="profile-info">
        <h3>{profile.firstname}</h3>
        <p>{profile.bio}</p>
        <p>Age: {profile.age}</p>
        <p>Location: {profile.city}, {profile.state}</p>
        <p>Gender: {profile.gender}</p>
        <p>Looking For: {profile.lookingFor}</p>
        <p>Gender Preference: {profile.genderPreference}</p>
        <p>Interests:</p>
        {profile.interests > 0
          ? <ul className="list-bubbles">{profile.interests.map((interest) => 
            <li key={interest.id}>{interest.interest}</li>)}
          </ul>
          : <p>(No interests saved)</p>
        }
        <p>Saved Activities:</p>
        {profile.activities > 0
          ? <ul className="list-bubbles">{profile.activities.map((activity) => 
            <li key={activity.id}>{activity.interest}</li>)}
          </ul>
          : <p>(No activities saved)</p>
        }
      </div>
    </animated.div>
  );
}
