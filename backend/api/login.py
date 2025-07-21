from flask import Blueprint, request, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests
from models.user import User
from flask_jwt_extended import create_access_token
import re

login_bp = Blueprint("login", __name__)

GOOGLE_CLIENT_ID = "1023775324387-fhhbulp07ul0dmar1us5ujlrl1kf13gn.apps.googleusercontent.com"

@login_bp.route("/login", methods=["POST"])
def login():
    token = request.json.get("token")
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        google_user_id = idinfo["sub"]
        email = idinfo['email']
        email = re.sub(r'[@.]', '_', email)

        user = User.get_or_create(google_user_id, email)

        access_token = create_access_token(identity=user.email)
        print(access_token)
        return jsonify(access_token=access_token)

    except ValueError:
        return jsonify({"error": "Invalid token"}), 400
