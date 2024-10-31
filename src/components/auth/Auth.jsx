import { useState } from "react";
import { useLoginMutation, useRegisterMutation } from "./authSlice";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";

function Auth() {
  const navigate = useNavigate();

  //swap between register and login
  const [isLogin, setIsLogin] = useState(true);
  const authAction = isLogin ? "Login" : "Register";
  //register or login message
  const altCopy = isLogin
    ? "Register for an account here"
    : "Already registered? Login here";

  //mutate data for login/registration
  const [login, { error: loginError }] = useLoginMutation();
  const [register, { error: registerError }] = useRegisterMutation();

  //email and password to state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");

  //send user email/password to api
  const attemptAuth = async (event) => {
    event.preventDefault();

    //login or register
    const loginMethod = isLogin ? login : register;
    const credentials = { email, password, firstName };

    try {
      await loginMethod(credentials).unwrap();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <main className="loginMain">
        <h1>
          Hi, welcome to Convene! Please use the form to {authAction} below:
        </h1>
        <form className="authForm" onSubmit={attemptAuth}>
          <label>
            Email:
            <input
              placeholder="user@email.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>
          <label>
            Password:
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {!isLogin && (
            <label>
              First Name:
              <input
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
              />
            </label>
          )}
          <button>{authAction}</button>
        </form>
        <a className="regLink" href="#" onClick={() => setIsLogin(!isLogin)}>
          {altCopy}
        </a>
        {isLogin && loginError && <p role="alert">{loginError.data}</p>}
        {!isLogin && registerError && <p role="alert">{registerError.data}</p>}
      </main>
    </>
  );
}
export default Auth;
