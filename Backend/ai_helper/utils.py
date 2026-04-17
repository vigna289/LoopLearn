from huggingface_hub import InferenceClient
import os
import numpy as np

HF_TOKEN = os.getenv("HF_TOKEN")
if not HF_TOKEN:
    raise Exception("HF_TOKEN not found in environment variables")

client = InferenceClient(api_key=HF_TOKEN)

def get_embedding(text):
    """Convert text into embedding vector"""
    response = client.feature_extraction(
        model="sentence-transformers/all-MiniLM-L6-v2",
        inputs=text
    )
    return response[0]

def cosine_similarity(vec1, vec2):
    """Calculate similarity between two vectors"""
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
