import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  console.log(window.location.origin);

  return (
    <GoogleOAuthProvider clientId="1023775324387-fhhbulp07ul0dmar1us5ujlrl1kf13gn.apps.googleusercontent.com">
      <div className="login-container">
        <h1 className="login-title">Recipe Log</h1>
        <div className="login-button-wrapper">
          <GoogleLogin
            size="large"
            shape="rectangular"
            width="300"
            onSuccess={(credentialResponse) => {
              const token = credentialResponse.credential;
              localStorage.setItem("access_token", token);
              navigate("/home");
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
