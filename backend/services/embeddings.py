from sentence_transformers import SentenceTransformer

_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model

def embed_texts(texts):
    model = get_model()
    print("Getting embeddings . . .")
    return model.encode(texts).tolist()