import './HomePage.css';
import React, { useState, useEffect } from "react";
import InputBox from "../components/InputBox"

export default function HomePage() {
  const [urls, setUrls] = useState([""]);
  const [urlValidity, setUrlValidity] = useState([false]);
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState(null);
  const [loadingIngest, setLoadingIngest] = useState(false);
  const [loadingQuery, setLoadingQuery] = useState(false);

  // URL validation regex
  const urlRegex = /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+([/?#].*)?$/i;

  const handleAddWebsite = () => {
    setUrls([...urls, ""]);
    setUrlValidity([...urlValidity, false]);
  };

  const handleRemoveWebsite = (index) => {
    const newUrls = [...urls];
    const newValidity = [...urlValidity];
    newUrls.splice(index, 1);
    newValidity.splice(index, 1);
    setUrls(newUrls);
    setUrlValidity(newValidity);
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);

    const isValid = urlRegex.test(value);
    const newValidity = [...urlValidity];
    newValidity[index] = isValid;
    setUrlValidity(newValidity);
  };

  const isAllValid = urls.length > 0 && urlValidity.every(Boolean);

  const handlesubmitUrl = async () => {
    console.log("Entered URLs", urls);
    setLoadingIngest(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls,
          access_token: localStorage.getItem("access_token")
        }),
      });

      const data = await res.json();
      console.log("Response from backend:", data);
    } catch (error) {
      console.error("Error sending URLs:", error);
    } finally {
      setLoadingIngest(false);
    }
  };

  const handleQuery = async () => {
    setLoadingQuery(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setQueryResult(data);
      console.log("Query response:", data);
    } catch (error) {
      console.error("Error querying Chroma:", error);
    } finally {
      setLoadingQuery(false);
    }
  };

  return (
    <div className="app-container">
      <div className="section">
        <h1>Recipe Log</h1>
        <p>Enter URLs of recipe pages you’d like to store and search.</p>
        {urls.map((url, index) => (
          <InputBox
            key={index}
            value={url}
            onChange={(e) => handleUrlChange(index, e.target.value)}
            onClear={() => handleRemoveWebsite(index)}
            placeholder={`Website URL #${index + 1}`}
            isInvalid={url && !urlValidity[index]}
          />
        ))}

        <div className="button-group">
          <button className="primary-button" onClick={handleAddWebsite}>
            + Add Website
          </button>
          <button
            className="primary-button"
            onClick={handlesubmitUrl}
            disabled={!isAllValid || loadingIngest}
          >
            {loadingIngest ? "Loading..." : "Store Websites"}
          </button>
        </div>
      </div>

      <div className="section">
        <h1>Search Recipes</h1>
        <p>Ask any question about your stored recipes.</p>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Find chocolate desserts under 300 calories"
          className="input-field"
        />
        <button
          className="primary-button"
          onClick={handleQuery}
          disabled={loadingQuery}
        >
          {loadingQuery ? "Processing..." : "Submit Query"}
        </button>

        {queryResult && (
          <div className="result-box">
            <h2>Query Result:</h2>
            <p>{queryResult.results}</p>
          </div>
        )}
      </div>
    </div>
  );
}