import { useUpdateActivityMutation } from "./activitySlice";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useGetMeQuery } from "../users/userSlice";

export default function ActivityCard({ activity }) {
  const { data: user, isLoading, error } = useGetMeQuery();

  //state for changing button classnames when going or not going
  const [attending, setAttending] = useState(false);

  /*Using use effect to only run the logic when the user changes or the attending users
   Change to run the code only when its needed*/
  useEffect(() => {
    if (user) {
      const isAttending = user.activities?.some(
        (thisActivity) => thisActivity.id === activity.id
      );
      setAttending(isAttending);
    }
  }, [user]);

  const [updateActivity] = useUpdateActivityMutation();

  const toggleAttendance = async (newStatus) => {
    try {
      await updateActivity({
        id: activity.id,
        attending: newStatus,
      });
      setAttending(newStatus);
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
                attending
                  ? "switch-button left selected"
                  : "switch-button left not-selected"
              }
              onClick={() => toggleAttendance(true)}
            >
              Going
            </button>
            <button
              className={
                !attending
                  ? "switch-button right selected"
                  : "switch-button right not-selected"
              }
              onClick={() => toggleAttendance(false)}
            >
              Not going
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
