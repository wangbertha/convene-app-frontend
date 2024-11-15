import { useState, } from 'react';
import ProfileCard from './ProfileCard';
import '../../styles/BrowseProfiles.css';
import { useGetUsersQuery } from "../../services/userSlice";

export default function BrowseProfiles() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0); // Tracks the currently displayed profile
  const { data: users, isLoading, error } = useGetUsersQuery();
  // Fetch some profiles from the backend
  if (isLoading) {
    return <p>Loading profile...</p>;
}
if (error) {
    return <p>{error.data || "We ran into an error :("}</p>
}
  // Handle swiping (e.g., right for like, left for dislike)
  const handleSwipe = (direction) => {
    console.log(`Swiped ${direction} on profile: ${users[currentProfileIndex]?.name}`);
    setCurrentProfileIndex((prevIndex) => prevIndex + 1); // Move to the next profile
  };

  const currentProfile = users[currentProfileIndex]; // Get the current profile
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
