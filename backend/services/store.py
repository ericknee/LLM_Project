import chromadb
from chromadb.config import Settings

_client = None

def get_chroma_client():
    global _client
    if _client is None:
        _client = chromadb.PersistentClient(path="./chroma_db")
    return _client

def store_vectors(texts, embeddings, collection_name="my_docs"):
    client = get_chroma_client()
    print("Accessed chroma client . . .")
    print("Collection name:", collection_name)
    collection = client.get_or_create_collection(collection_name)
    # print(texts)
    # for i, doc in enumerate(texts):
    #     print(f"Document {i}: type={type(doc)} value={doc}")
    
    ids = [f"doc_{i}" for i in range(len(texts))]
    try:
        collection.add(
        documents=texts,
        embeddings=embeddings,
        ids=ids
        )
    except Exception as e:
        print("Error storing website:", e)
        print(texts)

    

    print(f"Added {ids} to collection: {collection_name}")

def query_vectors(query_embedding, collection_name="my_docs", n_results=5):
    client = get_chroma_client()
    print("Accessed chroma client . . .")
    print("Collection name:", collection_name)
    collection = client.get_collection(collection_name)

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=n_results
    )
    return results