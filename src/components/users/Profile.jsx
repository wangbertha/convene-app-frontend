import { useGetMeQuery } from "./userSlice";

import { useState } from "react"
import { useUpdateMeMutation } from "./userSlice";

import "../../styles/Profile.css";
import { useAddInterestMutation } from "../interests/interestSlice";

export default function Profile() {
    const { data: user, isLoading, error } = useGetMeQuery();

    if (isLoading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p>{error.error || "We ran into an error :("}</p>
    }

    return (
        <main>
            <h1>{user.firstname} {user.lastname ?? user.lastname}</h1>
            <img src={user.profilePicture ? user.profilePicture : ""} alt="Your (logged-in user) profile picture" />
            <ul className="profile-list">
                <li>
                    <ProfileSingleDetail label="First Name" type="firstname" value={user.firstname} />
                </li>
                <li>
                    <ProfileSingleDetail label="Last Name" type="lastname" value={user.lastname} />
                </li>
                <li>
                    <ProfileSingleDetail label="Email" type="email" value={user.email} />
                </li>
                <li className="profile-password">
                </li>
                <li className="profile-bio">
                    <ProfileSingleDetail label="Bio" type="bio" value={user.bio} />
                </li>
                <li className="profile-location">
                    <p>Location:</p>
                    <p>City: {user.city}</p>
                    <p>State: {user.state}</p>
                </li>
                <li>
                    <ProfileSingleDetail label="Age" type="age" value={user.age} />
                </li>
                <li>
                    <ProfileSingleDetail label="Gender" type="gender" value={user.gender} />
                </li>
                <li className="profile-interests">
                    <ProfileInterestsDetail label="Interests" type="interests" values={user.interests} />
                </li>
                <li>
                    <ProfileSingleDetail label="Looking For" type="lookingFor" value={user.lookingFor} />
                </li>
                <li>
                    <ProfileSingleDetail label="Gender Preference" type="genderPreference" value={user.genderPreference} />
                </li>
                {/* TODO: attendingEvents */}
            </ul>
        </main>
    )
}

function ProfileSingleDetail({ label, type, value }) {
    const [isEditing, setIsEditing] = useState(false);
    const [input, setInput] = useState(value || "");
    const [response, setResponse] = useState("");

    const [updateMe] = useUpdateMeMutation();

    async function sendUpdateMe(e) {
        e.preventDefault();

        try {
            const response = await updateMe({ [type]: input, });
            if (!response.error) {
                setIsEditing(false);
                setResponse("Saved!");
            } else {
                setResponse(response.error.data);
            }
        } catch (e) {
            setResponse(e.error);
        }
    }

    return (<>
        {isEditing
            ? <>
                <form onSubmit={sendUpdateMe}>
                    <label>{label} 
                        <input
                            placeholder={label}
                            type="text"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            autoComplete="given-name"
                        />
                    </label>
                    <button>Save</button>
                    {response && <p>{response}</p>}
                </form>
                <button onClick={() => {setIsEditing(false); setInput("")}}>Cancel</button>
            </>
            : <>
                <p>{label}: {value ? value : "<blank>"}</p>
                <button onClick={() => setIsEditing(true)}>Edit</button>
                {response && <p>{response}</p>}
            </>
        }
    </>)
};

function ProfileInterestsDetail({ label, type, values}) {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");

    const [updateMe] = useUpdateMeMutation();
    const [addInterest] = useAddInterestMutation();

    async function sendUpdateMyInterests(e) {
        e.preventDefault();

        try {
            const interestResponse = await addInterest({ interest: input });
            const interestConnectMeResponse = await updateMe({ interestToConnect: interestResponse.data });
            if (!interestResponse.error && !interestConnectMeResponse.error) {
                setInput("");
                setResponse("Saved!");
            } else {
                setResponse(interestConnectMeResponse.error.data);
            }
        } catch (e) {
            setResponse(e.error);
        }
    }

    async function sendDisconnectInterest(interest) {
        try {
            const disconnectResponse = await updateMe({ interestToDisconnect: interest })
            if (!disconnectResponse.error) {
                setResponse("Saved!");
            }
        } catch (e) {
            setResponse(e.error);
        }
    }

    return (<>
        <p>{label}:</p>
        {values
            ?  <ul className="list-bubbles">{values.map((interest) => 
                <li key={interest.id}>{interest.interest}<button className="list-bubble-delete" onClick={() => sendDisconnectInterest(interest)}>x</button></li>
            )}</ul>
            : "Add interests to your profile!"
        }
        <form onSubmit={sendUpdateMyInterests}>
            <input
                placeholder={"Add a new interest"}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                autoComplete="given-name"
            />
            <button>Add</button>
            {response && <p>{response}</p>}
        </form>
    </>)
}