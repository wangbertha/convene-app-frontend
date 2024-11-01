import { useParams } from "react-router-dom";
import { useGetEventQuery } from "./eventsSlice";
import "../../styles/event.css";

export default function Event(){
    const { id } = useParams();
    const { data: event, isLoading, error } = useGetEventQuery(id);

    if (isLoading) {
        return <p>Loading event details...</p>;
    }
        
    if (error) {
        return <p>Error loading event: {error.message}</p>;
    }

    console.log(event);

    return (
        <main className="event-details">
            <ul>
                <li><h2>{event.name}</h2></li>
                <li>
                    <img src={event.logo} alt={`${event.name} logo`} className="event-logo" />
                </li>
                <li>
                    <time dateTime={event.startTime}>{new Date(event.startTime).toLocaleString()}</time> - 
                    <time dateTime={event.endTime}>{new Date(event.endTime).toLocaleString()}</time>
                </li>
                <li><p>Venue: {event.venue}</p></li>
                <li><p>{event.summary}</p></li>
                <li><a href={event.url} target="_blank" rel="noopener noreferrer">{event.url}</a></li>
                <li><p>Category: {event.category}</p></li>
            </ul>
            
            <section className="attendees">
                <h3>Attendees</h3>
                <ul className="attendees-list">
                    {event.attendingUsers.map(user => (
                        <li key={user.id} className="attendee">
                            <img src={user.profilePicture} alt={`${user.firstname} ${user.lastname}`} className="profile-picture" />
                            <div>
                                <p><strong>{user.firstname} {user.lastname}</strong></p>
                                <p>{user.bio}</p>
                                <p>{user.city}, {user.state}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
