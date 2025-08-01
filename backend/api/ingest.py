from flask import Flask, request, jsonify, Blueprint, current_app
from flask_cors import CORS
from services.loader import load_and_split_text
from services.embeddings import embed_texts
from services.store import store_vectors

ingest_bp = Blueprint("ingest", __name__)

@ingest_bp.route("/ingest", methods=["POST", "OPTIONS"])
def ingest_urls():
    if request.method == "OPTIONS":
        return current_app.make_default_options_response()

    data = request.get_json()
    urls = data.get("urls", [])
    access_token = data.get("access_token", "")

    print("Received URLs:", urls)


    # [[doc 1 chunks], [doc 2 chunks], . . .]
    chunks = load_and_split_text(urls)

    vectors = []
    for doc in chunks:
        vectors.append(embed_texts(doc))
    
    for (chunk, vector) in zip(chunks, vectors):
        print("CHUNK", len(chunk))
        print("VECTOR", len(vector))
        if not len(chunk) or not len(vector):
            print("Error accessing website")
        store_vectors(chunk, vector, access_token)
    print("Stored vectors . . .")
    # print("yes")
    
    # print(len(chunks))
    # for chunk in chunks:
    #     print(chunk)
    #     print("\n")
    
    return jsonify({
        "status": "received",
        "count": len(urls),
        "chunks_count": len(chunks),
        "chunk_contents": chunks
    })