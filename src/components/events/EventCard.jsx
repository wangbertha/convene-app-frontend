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
