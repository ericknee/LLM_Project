import './App.css';
import React, { useState } from "react";


function App() {
  const [urls, setUrls] = useState([""]);
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState(null);

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

  const handleQuery = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({query})
      })

      const data = await res.json();
      setQueryResult(data)
      console.log("Query response:", data);
    }

    catch (error) {
      console.error("Error querying Chroma:", error)
    }
  }


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

      <div>

          <h1> Website Query </h1>
            <input
              key={100}
              type="text"
              value={query}
              onChange={(e) => {
                const newQuery = e.target.value;
                setQuery(newQuery);
              }}
              placeholder={"Enter query"}
              style={{ display: "block", marginBottom: "0.5rem" }}
            />
            <button onClick={handleQuery}> Submit Query </button>
      </div>

      <div>
          {queryResult && (
            <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
              <h2> Query Result: </h2>
              {queryResult.results}
            </div>
          )}
      </div>
        

    </div>

  );
}

export default App;
