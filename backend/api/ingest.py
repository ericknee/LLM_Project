from flask import Flask, request, jsonify, Blueprint, current_app
from flask_cors import CORS

ingest_bp = Blueprint("ingest", __name__)

@ingest_bp.route("/ingest", methods=["POST", "OPTIONS"])
def ingest_urls():
    
    if request.method == "OPTIONS":
        # Respond to preflight
        return current_app.make_default_options_response()
    
    data = request.get_json()
    urls = data.get("urls", [])
    print("Received URLs:", urls)
        
    return jsonify({"status": "received", "count": len(urls)})