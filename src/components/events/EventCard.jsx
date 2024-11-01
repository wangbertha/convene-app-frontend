import { useSelector } from "react-redux";
import { selectToken } from "../auth/authSlice";
import { useUpdateEventMutation } from "./eventsSlice";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  const date = event.startTime.slice(0, 10);
  const time = event.startTime.slice(11, 19);

  const token = useSelector(selectToken);

  //state for changing button classnames when going or not going
  const [attending, setAttending] = useState(false);

  /*Using use effect to only run the logic when the user changes or the attending users
   Change to run the code only when its needed*/
  useEffect(() => {
    if (token) {
      // Decode token to get user ID
      //Extracts the id of the the decoded users token
      const { id: userId } = jwtDecode(token);
      const isAttending = event.attendingUsers?.some(
        (user) => user.id === userId
      );
      setAttending(isAttending);
    }
  }, [token, event.attendingUsers]);

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
        <a href={event.url}>
          <h3 className="event-name">{event.name}</h3>
        </a>
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
      {token && (
        <div className="going-buttons">
          <button
            className={attending ? "selected-button" : "not-selected-button"}
            onClick={() => toggleAttendance(true)}
          >
            Going
          </button>
          <button
            className={!attending ? "selected-button" : "not-selected-button"}
            onClick={() => toggleAttendance(false)}
          >
            Not going
          </button>
          <button className="info-button">More info</button>
          {/* <Link to={`/events/${event.id}`}>More info</Link> */}
        </div>
      )}
    </li>
  );
}
