import React, { useState, useEffect } from 'react';
import ProfileCard from '../components/profileCard';
import '../styles/BrowseProfiles.css';

export default function BrowseProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  useEffect(() => {
    const fetchProfiles = async () => {
      const data = [
        { id: 1, name: 'Alice', bio: 'Love hiking and outdoor activities.', age: 25, image: '/path/to/image1.jpg' },
        { id: 2, name: 'Bob', bio: 'Tech enthusiast and musician.', age: 30, image: '/path/to/image2.jpg' },
      ];
      setProfiles(data);
    };
    fetchProfiles();
  }, []);

  const handleSwipe = (direction) => {
    console.log(`Swiped ${direction} on profile: ${profiles[currentProfileIndex].name}`);
    setCurrentProfileIndex((prevIndex) => prevIndex + 1); 
  };

  const currentProfile = profiles[currentProfileIndex];

  return (
    <div className="browse-profiles">
      {currentProfile ? (
        <ProfileCard profile={currentProfile} onSwipe={handleSwipe} />
      ) : (
        <p>No more profiles to browse.</p>
      )}
    </div>
  );
}
