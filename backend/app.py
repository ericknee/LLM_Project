from flask import Flask, request, jsonify
from flask_cors import CORS
from api.ingest import ingest_bp
from api.query import query_bp
from api.login import login_bp
from extensions import db, migrate
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://flask_user:Temporary36!@localhost:5432/recipe_log"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "temporary-secret-key"  # Make this a secure key in production
jwt = JWTManager(app)
    
CORS(app, origins=["http://localhost:3000", "http://localhost",  "http://localhost:3000/login", "http://localhost:3000/home"])

db.init_app(app)
migrate.init_app(app, db)
app.register_blueprint(ingest_bp)
app.register_blueprint(query_bp)
app.register_blueprint(login_bp)

if __name__ == "__main__":
    app.run(debug=True, use_reloader=True)
