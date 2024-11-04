import { useGetMeQuery, useUpdatePasswordMutation } from "./userSlice";

import { useState } from "react"
import { useUpdateMeMutation } from "./userSlice";

import "../../styles/Profile.css";
import { useAddInterestMutation, useGetInterestsQuery } from "../interests/interestSlice";
import EventCard from "../events/EventCard";

export default function Profile() {
    const { data: user, isLoading, error } = useGetMeQuery();

    const genderOptions = ["Male", "Female", "Nonbinary", "Other"];
    const lookingForOptions = ["Friends", "Romantic Partner", "Other"];
    const genderPreferenceOptions = ["Male", "Female", "Any"];

    if (isLoading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        console.log(error);
        return <p>{error.data || "We ran into an error :("}</p>
    }

    return (
        <main>
            <h1>{user.firstname} {user.lastname ?? user.lastname}</h1>
            <img src={user.profilePicture ? user.profilePicture : ""} alt="Your (logged-in user) profile picture" />
            <ul className="profile-list">
                <li>
                    <ProfileTextDetail label="First Name" type="firstname" value={user.firstname} />
                </li>
                <li>
                    <ProfileTextDetail label="Last Name" type="lastname" value={user.lastname} />
                </li>
                <li>
                    <ProfileTextDetail label="Email" type="email" value={user.email} />
                </li>
                <li className="profile-password">
                    <ProfilePasswordDetail label="Password" />
                </li>
                <li className="profile-bio">
                    <ProfileTextDetail label="Bio" type="bio" value={user.bio} />
                </li>
                <li className="profile-location">
                    <ProfileLocationDetail label="Location" value={{ city: user.city, state: user.state }} />
                </li>
                <li>
                    <ProfileTextDetail label="Age" type="age" value={user.age} />
                </li>
                <li>
                    <ProfileOptionsDetail label="Gender" type="gender" value={user.gender} options={genderOptions} />
                </li>
                <li className="profile-interests">
                    <ProfileInterestsDetail label="Interests" values={user.interests} />
                </li>
                <li>
                    <ProfileOptionsDetail label="Looking For" type="lookingFor" value={user.lookingFor} options={lookingForOptions} />
                </li>
                <li>
                    <ProfileOptionsDetail label="Gender Preference" type="genderPreference" value={user.genderPreference} options={genderPreferenceOptions} />
                </li>
            </ul>
            <ProfileEventsDetail label="Attending Events" type="attendingEvents" values={user.attendingEvents} />
        </main>
    )
}

function ProfileTextDetail({ label, type, value }) {
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

    if (isEditing) {
        return (<>
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
        </>)
    }

    return (<>
        <p>{label}: {value ? value : "<blank>"}</p>
        <button onClick={() => setIsEditing(true)}>Edit</button>
        {response && <p>{response}</p>}
    </>)
};

function ProfileOptionsDetail({ label, type, value, options }) {
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

    if (isEditing) {
        return (<>
            <form onSubmit={sendUpdateMe}>
                <label>{label}:
                    <select  value={input} onChange={(e) => setInput(e.target.value)}>
                        <option value="">Please select an option</option>
                        {options.map((option) => 
                            <option key={option} value={option}>
                                {option}
                            </option>
                        )}
                    </select>
                </label>
                <button>Save</button>
                {response && <p>{response}</p>}
            </form>
            <button onClick={() => {setIsEditing(false); setInput("")}}>Cancel</button>
        </>)
    }

    return (<>
        <p>{label}: {value ? value : "<blank>"}</p>
        <button onClick={() => setIsEditing(true)}>Edit</button>
        {response && <p>{response}</p>}
    </>)
};

function ProfilePasswordDetail({ label }) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [response, setResponse] = useState("");

    const [updatePassword] = useUpdatePasswordMutation();

    async function sendUpdatePassword(e) {
        e.preventDefault();

        try {
            const response = await updatePassword({ currentPassword, newPassword });
            if (!response.error) {
                setIsEditing(false);
                setResponse(response.data.message);
                setCurrentPassword("");
                setNewPassword("");
            } else {
                setResponse(response.error.data);
            }
        } catch (e) {
            setResponse(e.error);
        }
    }

    if (isEditing) {
        return (<>
            <form onSubmit={sendUpdatePassword}>
                <label>Current Password
                    <input
                        placeholder="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        autoComplete="given-name"
                    />
                </label>
                <label>New Password
                    <input
                        placeholder="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        autoComplete="given-name"
                    />
                </label>
                <button>Save</button>
                {response && <p>{response}</p>}
            </form>
            <button onClick={() => {setIsEditing(false); setCurrentPassword(""); setNewPassword("")}}>Cancel</button>
        </>)
    }

    return (<>
        <p>{label}: ****</p>
        <button onClick={() => setIsEditing(true)}>Change Password</button>
        {response && <p>{response}</p>}
    </>)
};

function ProfileLocationDetail({ label, value }) {
    const [isEditing, setIsEditing] = useState(false);
    const [city, setCity] = useState(value.city || "");
    const [state, setState] = useState(value.state || "");
    const [response, setResponse] = useState("");

    const [updateMe] = useUpdateMeMutation();

    async function sendUpdateMe(e) {
        e.preventDefault();

        try {
            const response = await updateMe({ city, state });
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

    if (isEditing) {
        return (<>
            <form onSubmit={sendUpdateMe}>
                <p>{label}:</p>
                <label>City: 
                    <input
                        placeholder="City"
                        type="text"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        autoComplete="given-name"
                    />
                </label>
                <label>State: 
                    <input
                        placeholder="State"
                        type="text"
                        value={state}
                        onChange={(event) => setState(event.target.value)}
                        autoComplete="given-name"
                    />
                </label>
                <button>Save</button>
                {response && <p>{response}</p>}
            </form>
            <button onClick={() => {setIsEditing(false); setCity(""); setState("")}}>Cancel</button>
        </>)
    }

    return (<>
        <p>{label}:</p>
        <p>City: {city ? city : "<blank>"}</p>
        <p>State: {state ? state : "<blank>"}</p>
        <button onClick={() => setIsEditing(true)}>Edit</button>
        {response && <p>{response}</p>}
    </>);
}

function ProfileInterestsDetail({ label, values }) {
    const { data: interests } = useGetInterestsQuery();
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

    async function sendExistingInterest(interest) {
        try {
            const interestConnectMeResponse = await updateMe({ interestToConnect: interest });
            if (!interestConnectMeResponse.error) {
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
            {interests && (input.length > 0
            ? <ul>
                {interests.filter((interest) => interest.interest.slice(0, input.length) === input)
                    .map((interest) => (<li key={interest.id} onClick={() => sendExistingInterest(interest)}>{interest.interest}</li>))}
                </ul>
            : <>
                <p>Suggestions:</p>
                <ul>
                    {interests.slice(0,5).map((interest) => (<li key={interest.id} onClick={() => sendExistingInterest(interest)}>{interest.interest}</li>))}
                </ul>
            </>)}
            {response && <p>{response}</p>}
        </form>
    </>)
}

function ProfileEventsDetail({ label, values }) {
    return (<>
    <p>{label}:</p>
    {values ? values.map((event) => (<EventCard key={event.id} event={event}/>))
    : <p>Add events to your profile!</p>}
    </>)
}