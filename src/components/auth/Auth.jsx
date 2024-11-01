import { useState } from "react";
import { useLoginMutation, useRegisterMutation } from "./authSlice";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";

function Auth() {
  const navigate = useNavigate();

  //swap between register and login
  const [isLogin, setIsLogin] = useState(true);
  const authAction = isLogin ? "login" : "register";
  //register or login message
  const altCopy = isLogin
    ? "Register for an account here"
    : "Already registered? Click here to login";

  //mutate data for login/registration
  const [login, { error: loginError }] = useLoginMutation();
  const [register, { error: registerError }] = useRegisterMutation();

  //email and password to state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");

  //send user email/password to api
  const attemptAuth = async (event) => {
    event.preventDefault();

    //login or register
    const loginMethod = isLogin ? login : register;
    const credentials = { email, password, firstname };

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
        <img
          className="authImg"
          src="../../../public/popcorn_pals_convene.png"
          alt="Convene Logo"
        />
        <h1>Hi, Welcome to Convene!</h1>
        <h2>Please use the form below to {authAction}:</h2>
        <form className="authForm" onSubmit={attemptAuth}>
          <label className="authBox">
            Email:
            <input
              placeholder="user@email.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="authBox">
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
            <label className="authBox">
              First Name:
              <input
                placeholder="First Name"
                type="text"
                value={firstname}
                onChange={(event) => setFirstname(event.target.value)}
                autoComplete="given-name"
              />
            </label>
          )}
          <button className="authButton">{authAction}</button>
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
