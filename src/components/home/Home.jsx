import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetActivitiesQuery } from "../../services/activitySlice";
import "../../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  const { data: activities, isLoading, error } = useGetActivitiesQuery();

  if (isLoading) return <h2>Looking for upcoming Activities</h2>;

  if (error) return <p>{error.message}</p>;

  if (!activities.length) return <p>No upcoming activities</p>;

  const handleClick = () => {
    setFadeOut(true);
    setTimeout(() => navigate("/login"), 300);
  };

  return (
    <main>
      <section className="welcome-section">
        <h1>Welcome to Convene</h1>
        <p>Where Popcorn Pals Convene</p>
      </section>
      <div className="img-div">
        <img src="/popcornBucket.svg" alt="popcornBucket" />
        <img src="/popcornBucket.svg" alt="popcornBucket" />
      </div>
      <section className="card-section">
        <article className="right-card">
          <h2>About Convene</h2>
          <p>
            Welcome to Convene, the newest app to find friends, that special someone, or a companion for a local event. 
            Logged in users can add and edit information about themselves, add their interests, create a list of other 
            liked users to connect with, one-to-one chat with other users, and add local activity types they 
            might be interested in attending.
          </p>
        </article>
        <article className="left-card">
          <h2>Top activities</h2>
          <ul className="activity-list">
            {activities.slice(0, 3).map((activity) => (
              <li key={activity.id} className="home-activity-card">
                <Link
                  to={`/activities/${activity.id}`}
                  className="home-activity-details"
                >
                  <h3>{activity.name}</h3>
                  <p>{activity.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

