import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetMeQuery } from "../users/userSlice";
import { useGetEventQuery, useUpdateEventMutation } from "./eventsSlice";
import "../../styles/event.css";

export default function Event() {
    const { id } = useParams();
    const { data: user, isLoading: isLoadingUser, error: userError } = useGetMeQuery();
    const { data: event, isLoading: isLoadingEvent, error: eventError } = useGetEventQuery(id);

    const [updateAttendance] = useUpdateEventMutation();
    const [isAttending, setIsAttending] = useState(event?.isAttending || false);

    useEffect(() => {
        if (event) {
            setIsAttending(event.isAttending);
        }
    }, [event]);

    if (isLoadingUser || isLoadingEvent) {
        return <p>Loading event details...</p>;
    }

    if (userError || eventError) {
        return <p>Error loading event: {userError?.message || eventError?.message}</p>;
    }
    
    async function attendanceSwitch() {
        if (!event || !user) return;

        try {
            setIsAttending(!isAttending);
            await updateAttendance({
                id: event.id,
                attending: !isAttending,
            });
        } catch (e) {
            console.error("Failed to update attendance:", e);
            setIsAttending(isAttending);
        }
    }

    return (
        <main className="event-details">
            <ul>
                <li><h2>{event.name}</h2></li>
                <li>
                    <img src={event.logo} alt={`${event.name} logo`} className="event-logo" />
                </li>
                <li className="event-information">
                    <time dateTime={event.startTime}>{new Date(event.startTime).toLocaleString()}</time> - 
                    <time dateTime={event.endTime}>{new Date(event.endTime).toLocaleString()}</time>
                    <p>Location: {event.venue}</p>
                    <p>Tickets: <a href={event.url} target="_blank" rel="noopener noreferrer">{event.url}</a></p>
                    <p>Category: {event.category}</p>
                </li>
                <li>
                    <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
                        <input
                            type="checkbox"
                            id="filter"
                            checked={isAttending}
                            onChange={attendanceSwitch}
                        />
                        <span>Attending</span>
                        <span>Not Attending</span>
                    </label>
                </li>
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
