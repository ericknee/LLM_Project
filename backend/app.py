from flask import Flask, request, jsonify
from flask_cors import CORS
from api.ingest import ingest_bp
from api.query import query_bp
from api.login import login_bp
from models import db


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///your.db" # configure postgreSQL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
CORS(app, origins=["http://localhost:3000"])

db.init_app(app)
app.register_blueprint(ingest_bp)
app.register_blueprint(query_bp)
app.register_blueprint(login_bp)

if __name__ == "__main__":
    app.run(debug=True, use_reloader=True)
