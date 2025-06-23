from flask import Flask, request, jsonify
from flask_cors import CORS
from api.ingest import ingest_bp

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# @app.route("/ask", methods=["POST"])
# def ask():
#     question = request.json.get("question", "")
#     return jsonify({"answer": f"You asked: {question}"})

app.register_blueprint(ingest_bp)

if __name__ == "__main__":
    app.run(debug=True)
