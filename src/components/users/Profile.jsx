import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";

import { useDeleteMeMutation, useUpdateMeMutation, useGetMeQuery, useUpdatePasswordMutation } from "../../services/userSlice";
import { useAddInterestMutation, useGetInterestsQuery } from "../../services/interestSlice";

import ActivityCard from "../activities/ActivityCard";

import defaultPicture from "/default-photo.jpg";
import "../../styles/Profile.css";

// Page component for Profile page
export default function Profile() {
    const { data: user, isLoading, error } = useGetMeQuery();

    // Option information for select-type inputs
    const genderOptions = ["Male", "Female", "Nonbinary", "Other"];
    const lookingForOptions = ["Friends", "Romantic Partner", "Any"];
    const genderPreferenceOptions = ["Male", "Female", "Nonbinary", "Any"];
    const stateOptions = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN",
        "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM",
        "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "UV", "VA", "WA", "WV",
        "WI", "WY", "DC", "GU", "MH", "MP", "PR", "VI"];
    const ageOptions = Array.from({ length: 101-14 }, (_, i) => i + 14);

    // GetMe error/pending response handlers
    if (isLoading) {
        return <p>Loading profile...</p>;
    }
    if (error) {
        return <p>{error.data || "We ran into an error :("}</p>
    }

    return (
        <div className="page profile">
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
                    <li>
                        <ProfileDetail label="Password" type="password" layout="password" />
                    </li>
                    <li>
                        <ProfileDetail label="Bio" type="bio" layout="text" value={user.bio} />
                    </li>
                    <li>
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
                <ProfileActivitiesDetail values={user.activities} />
            </section>
        </div>
    )
}

// Reusable component that displays the profile detail and includes a form to edit the profile detail
function ProfileDetail({ label, type, layout, value, options }) {
    const [isEditing, setIsEditing] = useState(false);
    const [input, setInput] = useState(value || "");
    const [response, setResponse] = useState("");

    const [updateMe] = useUpdateMeMutation();
    const [updatePassword] = useUpdatePasswordMutation();

    /**
     * Toggles the isEditing status;
     * if isEditing, the edit form is shown;
     * if not isEditing, the user's detail is shown in plain text
     */
    function toggleIsEditing() {
        if (!isEditing) {
            setResponse("");
        } else {
            setResponse("Canceled");
        }
        setIsEditing(!isEditing); 
        setInput(value || "");
    }

    // Sends form inputs to update the user details
    // Accounts for one-off layouts: password, location
    async function sendUpdateMe(e) {
        e.preventDefault();

        try {
            const response = layout === "password"
                ? await updatePassword({ 
                    currentPassword: input.currentPassword, 
                    newPassword: input.newPassword 
                })
                : layout === "location" 
                ? await updateMe({ 
                    city: input.city, 
                    state: input.state 
                })
                : await updateMe({ [type]: input });

            // All details except for the password preserve the form entry to continue edits in the same session
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
        {/* Profile Picture */}
        {layout === "profilePicture" && 
            <img className="profile-picture" src={value ? value : defaultPicture} alt="Your profile picture" />
        }
        {/* If isEditing, display edit form */}
        {isEditing
            ? <form className="profile-detail-row" onSubmit={sendUpdateMe}>
                <label>
                    <h6>{label}:</h6>
                    {layout === "password"
                        ? <span>****</span>
                    : layout === "location" 
                        ? <span>{" "}</span>
                    : <>
                        {(layout === "text" || layout === "profilePicture")
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
                    </>
                }
                </label>
                <div className="form-column-btns">
                    {isEditing && <button type="submit">Save</button>}
                    <button type="button" onClick={toggleIsEditing}>{!isEditing ? "Edit" : "X"}</button>
                </div>
            </form>

        // If not isEditing, display information (value)
            : <div className="profile-detail-row">
                <h6>{label}:</h6>
                <span>
                    {layout === "password"
                        ? "****"
                    : layout === "location" 
                        ? " "
                    : layout === "profileActive"
                        ? (value ? "Active" : "Inactive")
                    : (value ? value : "<blank>")
                    }
                </span>
                {/* Edit toggle and save buttons */}
                <div className="form-column-btns">
                    {isEditing && <button type="submit">Save</button>}
                    <button type="button" onClick={toggleIsEditing}>{!isEditing ? "Edit" : "X"}</button>
                </div>
            </div>
        }

        {/* Special display case if type is location to group city and state details together */}
        {(layout === "location" && !isEditing) && 
            <>
                <div className="profile-detail-row secondary-row">
                    <h6>City:</h6>
                    <span>{value.city ? value.city : "<blank>"}</span>
                    <div className="form-column-btns">{" "}</div>
                </div>
                <div className="profile-detail-row secondary-row">
                    <h6>State:</h6>
                    <span>{value.state ? value.state : "<blank>"}</span>
                    <div className="form-column-btns">{" "}</div>
                </div>
            </>
        }

        {/* Special form edit case if type is password or location to handle multiple inputs */}
        {isEditing && 
            (layout === "password"
                ? <form className="secondary-row" onSubmit={sendUpdateMe}>
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
                </form>
            : layout === "location"
                ? <form className="secondary-row" onSubmit={sendUpdateMe}>
                    <label>
                        <h6>City:</h6>
                        <input
                            placeholder="City"
                            type="text"
                            value={input.city}
                            onChange={(e) => setInput((prevState) => ({...prevState, city: e.target.value}))}
                            autoComplete="given-name"
                        />
                    </label>
                    <label>
                        <h6>State:</h6>
                        <select value={input.state} onChange={(e) => setInput((prevState) => ({...prevState, state: e.target.value}))}>
                            <option value="">Please select an option</option>
                            {options.map((stateOption) => 
                                <option key={stateOption} value={stateOption}>
                                    {stateOption}
                                </option>
                            )}
                        </select>
                    </label>
                </form>
                : null
            )}
        
        {/* Special message case for profileActive to show description */}
        {layout === "profileActive" && <p className="profile-detail-description">
            An active profile will be visible to other users, and will help you make the most of our services!
        </p>}

        {/* Display database API response */}
        <p className="profile-response">{response}</p>
    </>)
};

// Custom ProfileDetail component for the special case of deleting the profile
function ProfileDeleteDetail() {
    const [isEditing, setIsEditing] = useState(false);
    const [response, setResponse] = useState("");

    const [deleteMe] = useDeleteMeMutation();
    const navigate = useNavigate();

    function toggleIsEditing() {
        setIsEditing(!isEditing);
    }

    /**
     * Deletes the logged in user from the database
     */
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
        {isEditing && <p className="profile-detail-description">Are you sure you want to delete your account? This action cannot be undone.</p>}
        <div className="form-column-btns">
            {isEditing && <button onClick={sendDeleteMe}>Yes</button>}
            <button type="button" onClick={toggleIsEditing}>{!isEditing ? "Delete Account" : "No"}</button>
        </div>
        <p className="profile-response">{response}</p>
    </>)
}

// Displays the user's saved interests with functionality to add and delete to their interests
function ProfileInterestsDetail({ label, values }) {
    const { data: interests } = useGetInterestsQuery();
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");

    const [updateMe] = useUpdateMeMutation();
    const [addInterest] = useAddInterestMutation();

    /**
     * Adds the form input as an interest and connects it to the user's profile
     * @param {*} e Form event
     */
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

    /**
     * Adds an existing interest to the user's profile
     * @param {Object} interest An interest that already exists in the database
     */
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

    /**
     * Removes an interest from the user's profile
     * @param {Object} interest An interest that is already connected to the user's profile
     */
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
        {/* Displays the user's interests */}
        {values
            ?  <ul className="list-bubbles">{values.map((interest) => 
                <li key={interest.id}>{interest.interest}<button className="list-bubble-delete" onClick={() => sendDisconnectInterest(interest)}>x</button></li>
            )}</ul>
            : "Add interests to your profile!"
        }

        {/* Display database API response if interests are */}
        <p className="profile-response">{response}</p>

        <div className="profile-interests-add">
            <h6 className="block-header">Common Interests:</h6>

            {/* If user hasn't typed any input, display the first 5 interests in the database 
            as clickable interests to add */}
            {/* If the user has starting typing an input, display all existing interests that match
            the current input */}
            {interests && (input.length > 0
                ? <ul className="list-bubbles">
                    {interests.filter((interest) => interest.interest.slice(0, input.length) === input)
                        .map((interest) => (<li key={interest.id} onClick={() => sendExistingInterest(interest)}>{interest.interest}</li>))}
                </ul>
                : <ul className="list-bubbles">
                    {interests.slice(0,5).map((interest) => (<li key={interest.id} onClick={() => sendExistingInterest(interest)}>{interest.interest}</li>))}
                </ul>
            )}

            {/* Form to input a new interest, or generate suggestions from existing interests */}
            <form className="profile-detail-row" onSubmit={sendUpdateMyInterests}>
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
        </div>
    </>)
}

// Displays the user's saved activities with functionality to unsave their activities
function ProfileActivitiesDetail({ values }) {
    return (<>
        <h6 className="profile-attendingevents">Saved Activities:</h6>
        <Link to="/activities">Browse activities here!</Link>
        {values.length > 0 ? <ul>{values.map((event) => (<ActivityCard key={event.id} activity={event}/>))}</ul>
        : <p>You do not currently have any activities saved.</p>}
    </>)
}