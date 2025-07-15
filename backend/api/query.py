from flask import Flask, request, jsonify, Blueprint, current_app
from flask_cors import CORS
from services.store import query_vectors
from services.embeddings import embed_texts
from services.llm import llm_response


query_bp = Blueprint("query", __name__)

@query_bp.route("/query", methods=["POST", "OPTIONS"])
def query_db():
    if request.method == "OPTIONS":
        return current_app.make_default_options_response()
    
    data = request.get_json()
    print("Query.py data:", data)
    query = data.get("query", "")
    print("Query:", query)
    embedding = embed_texts(query)
    results = query_vectors(embedding)
    top_ids = results["ids"][0]
    top_texts = results["documents"][0]
    top_distances = results["distances"][0]

    context = "\n".join(top_texts)
    res = llm_response(query, context)
    print(res)
    # for doc_id, text, distance in zip(top_ids, top_texts, top_distances):
    #     print(f"ID: {doc_id}")
    #     print(f"Distance: {distance}")
    #     print(f"Text: {text}")
    #     print()
    
    return jsonify({
        "results": res
    })