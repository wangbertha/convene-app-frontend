import { Link } from "react-router-dom";

//Tooken import and selector
import { useSelector } from "react-redux";
import { selectToken } from "../../store/authSlice";

export default function EventCard({ event }) {
  const date = event.startTime.slice(0, 10);
  const time = event.startTime.slice(11, 19);

  const token = useSelector(selectToken);

  return (
    <li className="department-card">
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
      {token && <button>{attending ? "Not going" : "Im going"}</button>}
      <Link to={`/events/${event.id}`}>More info</Link>
    </li>
  );
}
