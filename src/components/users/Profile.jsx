import { useDeleteMeMutation, useUpdateMeMutation, useGetMeQuery, useUpdatePasswordMutation } from "../../services/userSlice";

import { useState } from "react"

import "../../styles/Profile.css";
import { useAddInterestMutation, useGetInterestsQuery } from "../../services/interestSlice";
import ActivityCard from "../activities/ActivityCard";
import { Link, useNavigate } from "react-router-dom";

import defaultPicture from "../../assets/default-photo.jpg";

export default function Profile() {
    const { data: user, isLoading, error } = useGetMeQuery();

    const genderOptions = ["Male", "Female", "Nonbinary", "Other"];
    const lookingForOptions = ["Friends", "Romantic Partner", "Any"];
    const genderPreferenceOptions = ["Male", "Female", "Nonbinary", "Any"];
    const stateOptions = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN",
        "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM",
        "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "UV", "VA", "WA", "WV",
        "WI", "WY", "DC", "GU", "MH", "MP", "PR", "VI"];
    const ageOptions = Array.from({ length: 101}, (_, i) => i);

    if (isLoading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        console.log(error);
        return <p>{error.data || "We ran into an error :("}</p>
    }

    return (
        <main className="page profile">
            <section className="profile-main-card">
            <h2>{user.firstname} {user.lastname ?? user.lastname}</h2>
                <ul className="profile-list">
                    <li className="profile-picture-detail">
                        <ProfileDetail label="Photo URL" type="profilePicture" layout="profilePicture" value={user.profilePicture} />
                    </li>
                    <li>
                        <ProfileDetail label="First Name" type="firstname" layout="text" value={user.firstname} />
                    </li>
                    <li>
                        <ProfileDetail label="Last Name" type="lastname" layout="text" value={user.lastname} />
                    </li>
                    <li>
                        <ProfileDetail label="Email" type="email" layout="text" value={user.email} />
                    </li>
                    <li className="profile-multirow-detail">
                        <ProfileDetail label="Password" type="password" layout="password" />
                    </li>
                    <li>
                        <ProfileDetail label="Bio" type="bio" layout="text" value={user.bio} />
                    </li>
                    <li className="profile-multirow-detail">
                        <ProfileDetail label="Location" layout="location" value={{ city: user.city, state: user.state }} options={stateOptions} />
                    </li>
                    <li>
                        <ProfileDetail label="Age" type="age" layout="options" value={user.age} options={ageOptions} />
                    </li>
                    <li>
                        <ProfileDetail label="Gender" type="gender" layout="options" value={user.gender} options={genderOptions} />
                    </li>
                    <li>
                        <ProfileDetail label="Profile Status" type="profileActive" layout="profileActive" value={user.profileActive} />
                    </li>
                    <li className="profile-delete-detail">
                        <ProfileDeleteDetail />
                    </li>
                </ul>
            </section>
            <section>
                <h2>Convene Settings</h2>
                <ul className="profile-list">
                    <li>
                        <ProfileDetail label="Looking For" type="lookingFor" layout="options" value={user.lookingFor} options={lookingForOptions} />
                    </li>
                    <li>
                        <ProfileDetail label="Gender Preference" type="genderPreference" layout="options" value={user.genderPreference} options={genderPreferenceOptions} />
                    </li>
                    <li className="profile-interests">
                        <ProfileInterestsDetail label="Interests" values={user.interests} />
                    </li>
                </ul>
                <ProfileEventsDetail values={user.activities} />
            </section>
        </main>
    )
}

function ProfileDetail({ label, type, layout, value, options }) {
    const [isEditing, setIsEditing] = useState(false);
    const [input, setInput] = useState(value || "");
    const [response, setResponse] = useState("");

    const [updateMe] = useUpdateMeMutation();
    const [updatePassword] = useUpdatePasswordMutation();

    function toggleIsEditing() {
        if (!isEditing) {
            setResponse("");
        } else {
            setResponse("Canceled");
        }
        setIsEditing(!isEditing); 
        setInput(value || "");
    }

    async function sendUpdateMe(e) {
        e.preventDefault();

        try {
            const response = layout === "location" 
                ? await updateMe({ 
                    city: input.city, 
                    state: input.state 
                })
                : layout === "password"
                ? await updatePassword({ 
                    currentPassword: input.currentPassword, 
                    newPassword: input.newPassword 
                })
                : await updateMe({ [type]: input });
            if (layout === "password") {
                setInput({
                    currentPassword: "",
                    newPassword: "",
                });
            }
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
        {layout === "profilePicture" && 
            <img className="profile-picture" src={value ? value : defaultPicture} alt="Your profile picture" />
        }
        <form onSubmit={sendUpdateMe}>
            {layout === "location" 
                ? <><h6>{label}:</h6>
                    <label>
                        <h6>City:</h6>
                        {!isEditing ? <span>{value.city ? value.city : "<blank>"}</span>
                        : <input
                            placeholder="City"
                            type="text"
                            value={input.city}
                            onChange={(e) => setInput((prevState) => ({...prevState, city: e.target.value}))}
                            autoComplete="given-name"
                        />}
                    </label>
                    <label>
                        <h6>State:</h6>
                        {!isEditing ? <span>{value.state ? value.state : "<blank>"}</span>
                        : <select value={input.state} onChange={(e) => setInput((prevState) => ({...prevState, state: e.target.value}))}>
                            <option value="">Please select an option</option>
                            {options.map((stateOption) => 
                                <option key={stateOption} value={stateOption}>
                                    {stateOption}
                                </option>
                            )}
                        </select>}
                    </label>
                </>
            : layout === "password"
                ? <>
                    <div className="password-header">
                        <h6>{label}:</h6>
                        <span>****</span>
                    </div>
                    {isEditing && <>
                        <label>
                            <h6>Current Password</h6>
                            <input
                                placeholder="Current Password"
                                type="password"
                                value={input.currentPassword}
                                onChange={(e) => setInput((prevState) => ({...prevState, currentPassword: e.target.value}))}
                                autoComplete="given-name"
                            />
                        </label>
                        <label>
                            <h6>New Password</h6>
                            <input
                                placeholder="New Password"
                                type="password"
                                value={input.newPassword}
                                onChange={(e) => setInput((prevState) => ({...prevState, newPassword: e.target.value}))}
                                autoComplete="given-name"
                            />
                        </label>
                    </>}
                </>
            : <label>
                <h6>{label}:</h6>
                {!isEditing ? layout === "profileActive"
                    ? <span>{value ? "Active" : "Inactive"}</span>
                    : <span>{value ? value : "<blank>"}</span>
                : (layout === "text" || layout === "profilePicture")
                    ? <input
                        placeholder={label}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        autoComplete="given-name"
                    />
                : layout === "options"
                    ? <select value={input} onChange={(e) => setInput(e.target.value)}>
                        <option value="">Please select an option</option>
                        {options.map((option) => 
                            <option key={option} value={option}>
                                {option}
                            </option>
                        )}
                </select>
                : layout === "profileActive"
                    ? <select value={input} onChange={(e) => setInput(e.target.value === "true")}>
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                    </select>
                : null}
            </label>
            }
            <div className="form-column-btns">
                {isEditing && <button type="submit">Save</button>}
                <button type="button" onClick={toggleIsEditing}>{!isEditing ? "Edit" : "X"}</button>
            </div>
        </form>
        {layout === "profileActive" && <p className="profile-active-description">
            An active profile will be visible to other users, and will help you make the most of our services!
        </p>}
        <p className="profile-response">{response}</p>
    </>)
};

function ProfileDeleteDetail() {
    const [isEditing, setIsEditing] = useState(false);
    const [response, setResponse] = useState("");

    const [deleteMe] = useDeleteMeMutation();
    const navigate = useNavigate();

    function toggleIsEditing() {
        setIsEditing(!isEditing);
    }

    async function sendDeleteMe() {
        try {
            await deleteMe();
            if (!response.error) {
                navigate("/login");
            } else {
                setResponse(response.error.data);
            }
        } catch (e) {
            setResponse(e.error);
        }
    }

    return (<>
        <h6>Delete Account</h6>
        {isEditing && <p>Are you sure you want to delete your account? This action cannot be undone.</p>}
        <div className="form-column-btns">
            {isEditing && <button onClick={sendDeleteMe}>Yes</button>}
            <button type="button" onClick={toggleIsEditing}>{!isEditing ? "Delete Account" : "No"}</button>
        </div>
        <p className="profile-response">{response}</p>
    </>)
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
        <h6>{label}:</h6>
        {values
            ?  <ul className="list-bubbles">{values.map((interest) => 
                <li key={interest.id}>{interest.interest}<button className="list-bubble-delete" onClick={() => sendDisconnectInterest(interest)}>x</button></li>
            )}</ul>
            : "Add interests to your profile!"
        }
        <form onSubmit={sendUpdateMyInterests}>
            <label>
                <h6>New Interest:</h6>
                <input
                    placeholder={"Add a new interest"}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoComplete="given-name"
                />
            </label>
            <button>Add</button>
        </form>
        <p className="profile-response">{response}</p>
        {interests && (input.length > 0
        ? <ul className="list-bubbles">
            {interests.filter((interest) => interest.interest.slice(0, input.length) === input)
                .map((interest) => (<li key={interest.id} onClick={() => sendExistingInterest(interest)}>{interest.interest}</li>))}
            </ul>
        : <>
            <p>Suggestions:</p>
            <ul className="list-bubbles">
                {interests.slice(0,5).map((interest) => (<li key={interest.id} onClick={() => sendExistingInterest(interest)}>{interest.interest}</li>))}
            </ul>
        </>)}
    </>)
}

function ProfileEventsDetail({ values }) {
    return (<>
        <h6 className="profile-attendingevents">Saved Activities:</h6>
        {values.length > 0 ? <ul>{values.map((event) => (<ActivityCard key={event.id} activity={event}/>))}</ul>
        : <p>You do not currently have any activities saved. <Link to="/activities">Browse activities here!</Link></p>}
    </>)
}