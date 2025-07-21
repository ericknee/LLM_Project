import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <GoogleOAuthProvider clientId="1023775324387-fhhbulp07ul0dmar1us5ujlrl1kf13gn.apps.googleusercontent.com">
      <div className="login-container">
        <h1 className="login-title">Recipe Log</h1>
        <div className="login-button-wrapper">
          <GoogleLogin
            size="large"
            shape="rectangular"
            width="300"
            onSuccess={async (credentialResponse) => {
              const googleToken = credentialResponse.credential;
              const response = await fetch("http://localhost:5000/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: googleToken,
              }),
            });

            const data = await response.json();
            if (response.ok) {
              localStorage.setItem("access_token", data.access_token);
              navigate("/home");
            } else {
              console.log("Login error", data);
            }
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
