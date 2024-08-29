import os
import qdrant_client
from llama_index.vector_stores.qdrant import QdrantVectorStore


def get_vector_store():
    collection_name = os.getenv("QDRANT_COLLECTION", "ragsaas")
    QDRANT_URL = os.getenv("QDRANT_URL")
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
    if not collection_name or not QDRANT_URL:
        raise ValueError(
            "Please set QDRANT_COLLECTION, QDRANT_URL"
            " to your environment variables or config them in the .env file"
        )
    if QDRANT_API_KEY:
        # creating a qdrant client instance
        client = qdrant_client.QdrantClient(
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY,
        )

        aclient = qdrant_client.AsyncQdrantClient(
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY,
        )

        store = QdrantVectorStore(
            client=client, aclient=aclient, collection_name=collection_name
        )
    else:
        client = qdrant_client.QdrantClient(
            url=QDRANT_URL,
        )

        aclient = qdrant_client.AsyncQdrantClient(
            url=QDRANT_URL,
        )

        store = QdrantVectorStore(
            client=client, aclient=aclient, collection_name=collection_name
        )
    return store
