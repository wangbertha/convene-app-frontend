import { useParams } from 'react-router-dom';

import { useGetUserQuery } from "../../services/userSlice";

import ProfileCard from './ProfileCard';

import "../../styles/ProfileById.css";

export default function ProfileById() {
  const { id } = useParams();
  const { data: user, isLoading, error } = useGetUserQuery(id);

  // Fetch some profiles from the backend
  if (isLoading) {
    return <p>Loading profile...</p>;
  }
  if (error) {
      return <p>{error.data || "We ran into an error :("}</p>
  }

  return (
    <div className="profile-by-id">
      <ProfileCard profile={user} />
    </div>
  );
}
