import ActivityCard from "./ActivityCard";
import { useGetActivitiesQuery } from "../../services/activitySlice";

import "../../styles/ActivitiesList.css";

//Function that renders the list of activity activities
export default function ActivityList() {
  const { data: activities, isLoading, error } = useGetActivitiesQuery();

  if (isLoading) return <h2>Looking for activities...</h2>;

  if (error) return <p>{error.message}</p>;

  if (!activities.length) return <p>No suggested activities</p>;

  return (
    <main className="main-activitylist">
      <h1 className="upcoming-activities">
        Suggested activities for your first meet-up!
      </h1>
      <ul className="activity-list">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </ul>
    </main>
  );
}
