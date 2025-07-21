import React, { useState } from "react";
import { useNavigate } from "react-router";
import InputBox from "../components/InputBox";

export default function HomePage() {
  const navigate = useNavigate();

  const [urls, setUrls] = useState([""]);
  const [urlValidity, setUrlValidity] = useState([false]);
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState(null);
  const [loadingIngest, setLoadingIngest] = useState(false);
  const [loadingQuery, setLoadingQuery] = useState(false);

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

  const handleSubmitQuery = async () => {
    setLoadingQuery(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          access_token: localStorage.getItem("access_token")
        }),
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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-950 text-white flex flex-col">
      {/* Top Bar with Log Out Button */}
      <div className="w-full bg-blue-100 flex items-center justify-between px-8 py-4 mb-8">
        <div></div>
        <button
          className="bg-white text-blue-800 hover:bg-blue-200 font-bold py-2 px-6 rounded shadow transition-colors duration-150"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto flex-1">
        
        {/* Left Section: Website URLs */}
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-semibold mb-2">Website URLs</h1>
          <p className="text-sm mb-4 text-blue-200">Enter URLs of recipe pages you’d like to store and search.</p>
          {urls.map((url, index) => (
            <div key={index} className="w-full max-w-xs mb-2 text-blue-600">
              <InputBox
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                onClear={() => handleRemoveWebsite(index)}
                placeholder={`Website URL #${index + 1}`}
                isInvalid={url && !urlValidity[index]}
              />
            </div>
          ))}
          <button
            className="w-full max-w-xs mb-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            onClick={handleAddWebsite}
          >
            + Add Website
          </button>
          <button
            className={`w-full max-w-xs ${!isAllValid || loadingIngest ? "bg-gray-500 cursor-not-allowed" : "bg-white text-blue-800 hover:bg-blue-100"} font-bold py-2 px-4 rounded`}
            onClick={handlesubmitUrl}
            disabled={!isAllValid || loadingIngest}
          >
            {loadingIngest ? "Loading..." : "Store Websites"}
          </button>
        </div>

        {/* Right Section: Submit Query */}
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-semibold mb-2">Search Recipes</h1>
          <p className="text-sm mb-4 text-blue-200">Ask any question about your stored recipes.</p>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Find chocolate desserts under 300 calories"
            className="w-full max-w-md mb-4 px-4 py-2 rounded-md bg-blue-800 text-white placeholder-blue-300 outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            className={`w-full max-w-md ${loadingQuery ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"} text-white font-bold py-2 px-4 rounded`}
            onClick={handleSubmitQuery}
            disabled={loadingQuery}
          >
            {loadingQuery ? "Processing..." : "Submit Query"}
          </button>

          {queryResult && (
            <div className="w-full max-w-md mt-6 p-4 bg-blue-800 rounded shadow-md">
              <h2 className="font-semibold text-lg mb-2">Query Result:</h2>
              <p className="text-blue-100">{queryResult.results}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
