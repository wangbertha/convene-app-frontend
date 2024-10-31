import { useParams } from "react-router-dom";
// import { useGetUserQuery } from "./userSlice";

import "../../styles/Profile.css";

export default function Profile() {
    const { id } = useParams();
    // const { data: user } = useGetUserQuery(id);

    return (
        <main>
            <h1>{user.firstname} {user.lastname ?? user.lastname}</h1>
            <img src={user.profilePicture ? user.profilePicture : ""} alt="" />
            <ul>
                <li>
                    <p>Email: {user.email}</p><button>Edit</button>
                </li>
                <li>
                    <p>Password: ****</p>
                </li>
                <li>
                    <p>Bio: {user.bio}</p>
                </li>
                <li>
                    <p>Location:</p>
                    <p>City: {user.city}</p>
                    <p>State: {user.state}</p>
                </li>
                <li>
                    <p>Age: {user.age}</p>
                </li>
                <li>
                    <p>Gender: {user.gender}</p>
                </li>
                <li>
                    <p>Interests:</p>
                    <input type="text"/>
                    {user.interests.length === 0 ? "Add interests to your profile!" : user.interests.map((interest) => <p key={interest.id}>{interest.interest}</p>)}
                </li>
                <li>
                    <p>Looking For:</p>
                    <p>{user.lookingFor}</p>
                </li>
                <li>
                    <p>Gender Preference:</p>
                    <p>{user.genderPreference}</p>
                </li>
                <li>
                    <p>Events Attending:</p>
                    {user.attendingEvents.length === 0 ? "Join an event!" : user.attendingEvents.map((event) => <p key={event.id}>{event.name}</p>)}
                </li>
            </ul>
        </main>
    )
}