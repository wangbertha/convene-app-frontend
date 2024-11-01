import { useSelector } from "react-redux";
import { selectToken } from "../auth/authSlice";
import { useUpdateEventMutation } from "./eventsSlice";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useGetMeQuery } from "../chat/userSlice";

export default function EventCard({ event }) {
  const date = event.startTime.slice(0, 10);
  const time = event.startTime.slice(11, 19);

  const token = useSelector(selectToken);

  const { data: user, isLoading, error } = useGetMeQuery();
  console.log(user);

  //state for changing button classnames when going or not going
  const [attending, setAttending] = useState(false);

  /*Using use effect to only run the logic when the user changes or the attending users
   Change to run the code only when its needed*/
  useEffect(() => {
    if (user) {
      const isAttending = user.attendingEvents?.some(
        (attendingEvents) => attendingEvents.id === event.id
      );
      setAttending(isAttending);
    }
  }, [user]);

  const [updateEvent] = useUpdateEventMutation();

  const toggleAttendance = async (newStatus) => {
    try {
      await updateEvent({
        id: event.id,
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
        <Link to={`/events/${event.id}`}>
          <h3 className="event-name">{event.name}</h3>
        </Link>
        <p>
          <b>Date:</b> {date}
        </p>
        <p>
          <b>Time:</b> {time}
        </p>
        <p>
          <b>Venue:</b> {event.venue}
        </p>
      </div>
      <div className="event-buttons">
        {token && (
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
        <Link className="info-button" to={`/events/${event.id}`}>
          More info
        </Link>
      </div>
    </li>
  );
}
