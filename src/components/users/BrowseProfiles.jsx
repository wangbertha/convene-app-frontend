import React, { useState, useEffect } from 'react';
import ProfileCard from '../../layout/ProfileCard';
import '../../styles/BrowseProfiles.css';

export default function BrowseProfiles() {
  const [profiles, setProfiles] = useState([]); // Stores fetched profiles
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0); // Tracks the currently displayed profile

  // Fetch profiles from the backend
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch('/profiles'); // Call the API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch profiles');
        }
        const data = await response.json(); // Parse the JSON response
        setProfiles(data); // Set the profiles in state
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  // Handle swiping (e.g., right for like, left for dislike)
  const handleSwipe = (direction) => {
    console.log(`Swiped ${direction} on profile: ${profiles[currentProfileIndex]?.name}`);
    setCurrentProfileIndex((prevIndex) => prevIndex + 1); // Move to the next profile
  };

  const currentProfile = profiles[currentProfileIndex]; // Get the current profile

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
