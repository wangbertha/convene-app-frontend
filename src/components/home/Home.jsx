import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetActivitiesQuery } from "../activities/activitySlice";
import "../../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  const { data: activities, isLoading, error } = useGetActivitiesQuery();
  console.log(activities);

  if (isLoading) return <h2>Looking for upcoming Events</h2>;

  if (error) return <p>{error.message}</p>;

  if (!activities.length) return <p>No upcoming events</p>;

  const handleClick = () => {
    setFadeOut(true);
    setTimeout(() => navigate("/login"), 300);
  };

  return (
    <main>
      <section class="welcome-section">
        <h1>Welcome to Convene</h1>
        <p>Where Popcorn Pals Convene</p>
      </section>
      <div className="img-div">
        <img src="../public/popcornBucket.svg" alt="popcornBucket" />
        <img src="../public/popcornBucket.svg" alt="popcornBucket" />
      </div>
      <section className="card-section">
        <article className="right-card">
          <h2>About Convene</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos
            vitae autem numquam quisquam animi et placeat qui sit excepturi,
            quasi ab consectetur officiis, consequuntur harum quam id!
            Repellendus, accusantium tempore!
          </p>
        </article>
        <article className="left-card">
          <h2>Top Events</h2>
          <ul className="event-list">
            {activities.slice(0, 3).map((event) => (
              <li key={event.id} className="home-event-card">
                <div className="home-event-details">
                  <h3>{event.name}</h3>
                  <p>{new Date(event.startTime).toLocaleString()}</p>
                  <p>{event.venue}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
