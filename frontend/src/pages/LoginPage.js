import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <GoogleOAuthProvider clientId="1023775324387-fhhbulp07ul0dmar1us5ujlrl1kf13gn.apps.googleusercontent.com">
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-950 text-white flex flex-col justify-center items-center">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-white">Recipe Log</h1>
          <p className="text-lg text-blue-200">Sign in to access your recipe collection</p>
        </div>
        <div className="bg-blue-800 p-8 rounded-lg shadow-xl">
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
            console.log(data)
            if (response.ok) {
              console.log("Response OK")
              localStorage.setItem("access_token", data.access_token);
              console.log("Navigating to home")
              navigate("/home");
              console.log("Navigated to home")
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
