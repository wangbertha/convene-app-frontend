import { useParams, Link } from "react-router-dom";
import { useGetMeQuery } from "../users/userSlice";
import { useGetEventQuery, useUpdateEventMutation } from "./eventsSlice";

import defaultPicture from "../../assets/default-photo.jpg";

import "../../styles/event.css";

export default function Event() {
  const { id } = useParams();
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useGetMeQuery();
  const {
    data: event,
    isLoading: isLoadingEvent,
    error: eventError,
  } = useGetEventQuery(id);

  const [updateAttendance] = useUpdateEventMutation();
  const isAttending =
    event && user
      ? user.attendingEvents?.some(
          (attendingEvent) => attendingEvent.id === event.id
        )
      : false;

  if (isLoadingUser || isLoadingEvent) {
    return <p>Loading event details...</p>;
  }

  if (userError || eventError) {
    return (
      <p>Error loading event: {userError?.message || eventError?.message}</p>
    );
  }

  async function attendanceSwitch() {
    if (!event || !user) return;

    try {
      await updateAttendance({
        id: event.id,
        attending: !isAttending,
      }).unwrap();

      await refetchUser();
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  }

  return (
    <main className="page event-details">
      <ul>
        <li>
          <h2>{event.name}</h2>
        </li>
        <li>
          <img
            src={event.logo}
            alt={`${event.name} logo`}
            className="event-logo"
          />
        </li>
        <li className="event-information">
          <div>
            <time dateTime={event.startTime}>
              {new Date(event.startTime).toLocaleString()}
            </time>{" "}
            -
            <time dateTime={event.endTime}>
              {new Date(event.endTime).toLocaleString()}
            </time>
            <p>Location: {event.venue}</p>
            <p>
              Tickets:{" "}
              <a href={event.url} target="_blank" rel="noopener noreferrer">
                {event.url}
              </a>
            </p>
            <p>Category: {event.category}</p>
          </div>
          <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
            <input
              type="checkbox"
              id="filter"
              checked={isAttending}
              onChange={attendanceSwitch}
            />
            <span>Not Attending</span>
            <span>Attending</span>
          </label>
        </li>
      </ul>

      <section className="attendees">
        <h3>Attendees</h3>
        <ul className="attendees-list">
          {event.attendingUsers.map((user) => (
            <Link to={`/profile/${user.id}`}>
              <li key={user.id} className="attendee">
                <img
                  src={
                    user.profilePicture ? user.profilePicture : defaultPicture
                  }
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
