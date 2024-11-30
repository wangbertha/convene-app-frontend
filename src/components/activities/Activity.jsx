import { useParams, Link } from "react-router-dom";

import { useGetMeQuery } from "../../services/userSlice";
import {
  useGetActivityQuery,
  useUpdateActivityMutation,
} from "../../services/activitySlice";

import "../../styles/activities.css";

export default function Activity() {
  const { id } = useParams();
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useGetMeQuery();
  const {
    data: activity,
    isLoading: isLoadingActivity,
    error: activityError,
  } = useGetActivityQuery(id);

  const [updateSaved] = useUpdateActivityMutation();
  const isSaved =
    activity && user
      ? user.activities?.some((thisActivity) => thisActivity.id === activity.id)
      : false;

  if (isLoadingUser || isLoadingActivity) {
    return <p>Loading activity details...</p>;
  }

  if (userError || activityError) {
    return (
      <p>
        Error loading activity: {userError?.message || activityError?.message}
      </p>
    );
  }

  async function savedSwitch() {
    if (!activity || !user) return;

    try {
      await updateSaved({
        id: activity.id,
        saved: !isSaved,
      }).unwrap();

      await refetchUser();
    } catch (error) {
      console.error("Error saving:", error);
    }
  }

  return (
    <main className="activity-details">
      <ul>
        <li>
          <h2>{activity.name}</h2>
        </li>
        <li>
          <img
            src={activity.logo}
            alt={`${activity.name} logo`}
            className="activity-logo"
          />
        </li>
        <li className="activity-information">
          <div>
            <p>
              <b>Description:</b>
            </p>
            <p>{activity.summary}</p>
            <p>
              <b>Suggested Location(s):</b>
            </p>
            <ul>
              {activity.locations.map((location, i) => (
                <li key={i}>{location}</li>
              ))}
            </ul>
            <p>
              <b>Planning Resource(s):</b>
            </p>
            <ul>
              {activity.urlResources.map((resource, i) => (
                <li key={i}>
                  <a href={resource} target="_blank" rel="noopener noreferrer">
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
            <p>
              <b>Category:</b>{" "}
              {activity.categories.map((category, i) => (
                <span key={i}>
                  {i !== 0 && ", "}
                  {category}
                </span>
              ))}
            </p>
          </div>
          <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
            <input
              type="checkbox"
              id="filter"
              checked={isSaved}
              onChange={savedSwitch}
            />
            <span>Not saved</span>
            <span>Saved</span>
          </label>
        </li>
      </ul>

      <section className="attendees">
        <h3>Saved Users</h3>
        <ul className="attendees-list">
          {activity.users.map((user) => (
            <Link key={user.id} to={`/profile/${user.id}`}>
              <li className="attendee">
                <img
                  src={user.profilePicture}
                  alt={`${user.firstname} ${user.lastname}`}
                  className="profile-picture"
                />
                <div>
                  <p>
                    <strong>
                      {user.firstname} {user.lastname}
                    </strong>
                  </p>
                  <p>{user.bio}</p>
                  <p>
                    {user.city}, {user.state}
                  </p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </section>
    </main>
  );
}
