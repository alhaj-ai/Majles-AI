def load_reranker_model():
    from sentence_transformers import CrossEncoder

    print("Loading reranker model...")
    model = CrossEncoder("BAAI/bge-reranker-v2-m3")
    print("Reranker model loaded.")
    return model
