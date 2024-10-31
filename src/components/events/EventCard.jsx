import { Link } from "react-router-dom";

//Tooken import and selector
// import { useSelector } from "react-redux";
// import { selectToken } from "../../store/authSlice";

export default function EventCard({ event }) {
  const date = event.startTime.slice(0, 10);
  const time = event.startTime.slice(11, 19);

  // const token = useSelector(selectToken);

  const token = true;
  const attending = true;

  return (
    <li className="event-card">
      <div className="event-details">
        <a href={event.url}>
          <h3>{event.name}</h3>
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
          {attending ? (
            <>
              <button className="selected-button">Going</button>
              <button className="not-selected-button">Not going</button>
            </>
          ) : (
            <>
              <button className="not-selected-button">Going</button>
              <button className="selected-button">Not going</button>
            </>
          )}
          <button className="info-button">More info</button>
        </div>
      )}

      {/* <Link to={`/events/${event.id}`}>More info</Link> */}
    </li>
  );
}

// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { selectToken } from "../auth/authSlice";
// import { useUpdateEventMutation } from "./eventsSlice";
// import { useState } from "react";

// export default function EventCard({ event }) {
//   const date = event.startTime.slice(0, 10);
//   const time = event.startTime.slice(11, 19);

//   const token = useSelector(selectToken);
//   const userId = useSelector(selectUserId);

//   // Check if the logged-in user is attending the event initially
//   const initialAttending = event.attendingUsers.some(
//     (user) => user.id === userId
//   );
//   const [attending, setAttending] = useState(initialAttending);

//   // Mutation hook for updating attendance
//   const [updateEvent] = useUpdateEventMutation();

//   const toggleAttendance = async (newStatus) => {
//     try {
//       // Call the mutation with event ID and updated attendance status
//       await updateEvent({
//         id: event.id,
//         userAttending: newStatus
//           ? [...event.attendingUsers, { id: userId }]
//           : event.attendingUsers.filter((user) => user.id !== userId),
//       });
//       // Optimistically update the local state to reflect the change
//       setAttending(newStatus);
//     } catch (error) {
//       console.error("Error updating attendance:", error);
//     }
//   };

//   return (
//     <li className="event-card">
//       <div className="event-details">
//         <a href={event.url}>
//           <h3>{event.name}</h3>
//         </a>
//         <p>
//           <b>Date:</b> {date}
//         </p>
//         <p>
//           <b>Time:</b> {time}
//         </p>
//         <p>
//           <b>Venue:</b> {event.venue}
//         </p>
//       </div>
//       {token && (
//         <div className="going-buttons">
//           <button
//             className={attending ? "selected-button" : "not-selected-button"}
//             onClick={() => toggleAttendance(true)}
//           >
//             Going
//           </button>
//           <button
//             className={!attending ? "selected-button" : "not-selected-button"}
//             onClick={() => toggleAttendance(false)}
//           >
//             Not going
//           </button>
//           <button className="info-button">More info</button>
//         </div>
//       )}
//     </li>
//   );
// }
