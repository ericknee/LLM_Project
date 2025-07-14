from flask import Flask, request, jsonify
from flask_cors import CORS
from api.ingest import ingest_bp
from api.query import query_bp

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

app.register_blueprint(ingest_bp)
app.register_blueprint(query_bp)

if __name__ == "__main__":
    app.run(debug=True, use_reloader=True)
