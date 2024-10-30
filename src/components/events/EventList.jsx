import EventCard from "./EventCard";
import { useGetEventsQuery } from "./eventsSlice";

import "./EventsList.css";

//Function that renders the list of events
export default function EventsList() {
  const { data: events, isLoading, error } = useGetEventsQuery();
  console.log(events);

  if (isLoading) return <h2>Looking for upcoming Events</h2>;

  if (error) return <p>{error.message}</p>;

  if (!events.length) return <p>No upcoming events</p>;

  return (
    <main>
      <h1>Upcoming events in your area</h1>
      <ul className="event-list">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </ul>
    </main>
  );
}
