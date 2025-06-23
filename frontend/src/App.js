import './App.css';
import React, { useState } from "react";


function App() {
  const [urls, setUrls] = useState([""]);

  const handleAddWebsite = () => {
    setUrls([...urls, ""]);
  };

  const handlePrintWebsites = async () => {
    console.log("Entered URLs", urls);

    try {
      const res = await fetch("http://127.0.0.1:5000/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({urls}),
      });

      const data = await res.json();
      console.log("Response from backend:", data);
    }

    catch (error) {
      console.error("Error sending URLs:", error)
    }


  };

  return (
    <div>
    
      {/* Dynamic Input Fields */}
      <div style={{padding : "2rem"}}>
        <h1> Input Websites </h1>
          {urls.map((url, index) =>
            <input
              key={index}
              type="text"
              value={url}
              onChange={(e) => {
                const newUrls = [...urls];
                newUrls[index] = e.target.value;
                setUrls(newUrls);
              }}
              placeholder={`Website URL #${index + 1}`}
              style={{ display: "block", marginBottom: "0.5rem" }}
            />
          )}
      </div>

      <div>
          <button onClick={handleAddWebsite}> Add Website </button>
          <button onClick={handlePrintWebsites}> Print Websites </button>
      </div>
        

    </div>

  );
}

export default App;
