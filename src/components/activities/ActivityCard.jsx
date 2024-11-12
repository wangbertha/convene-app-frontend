import { useUpdateActivityMutation } from "./activitySlice";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useGetMeQuery } from "../users/userSlice";

export default function ActivityCard({ activity }) {
  const { data: user, isLoading, error } = useGetMeQuery();

  //state for changing button classnames when saved or not saved
  const [saved, setSaved] = useState(false);

  /*Using use effect to only run the logic when the user changes or the saved users
   Change to run the code only when its needed*/
  useEffect(() => {
    if (user) {
      const isSaved = user.activities?.some(
        (thisActivity) => thisActivity.id === activity.id
      );
      setSaved(isSaved);
    }
  }, [user]);

  const [updateActivity] = useUpdateActivityMutation();

  const toggleSaved = async (newStatus) => {
    try {
      await updateActivity({
        id: activity.id,
        saved: newStatus,
      });
      setSaved(newStatus);
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  return (
    <li className="event-card">
      <div className="event-details-div">
        <Link to={`/activities/${activity.id}`}>
          <h3 className="event-name">{activity.name}</h3>
        </Link>
        <p>{activity.summary}</p>
      </div>
      <div className="event-buttons">
        {user && (
          <div className="switch-container">
            <button
              className={
                saved
                  ? "switch-button left selected"
                  : "switch-button left not-selected"
              }
              onClick={() => toggleSaved(true)}
            >
              Saved
            </button>
            <button
              className={
                !saved
                  ? "switch-button right selected"
                  : "switch-button right not-selected"
              }
              onClick={() => toggleSaved(false)}
            >
              Not saved
            </button>
          </div>
        )}
        <Link className="info-button" to={`/activities/${activity.id}`}>
          More info
        </Link>
      </div>
    </li>
  );
}
