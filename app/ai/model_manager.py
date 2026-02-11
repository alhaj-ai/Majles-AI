from app.ai.whisper import load_whisper
from app.ai.embedding_model import load_embedding_model
from app.ai.reranker_model import load_reranker_model


class ModelManager:

    def __init__(self):

        self.whisper = None
        self.embedding_model = None
        self.reranker_model = None



    def load_models(self):
        print("Loading AI models...")
        try:
            self.whisper = load_whisper()
            print("Whisper model loaded.")
        except Exception as e:
            print(f"Warning: Whisper model could not be loaded: {e}")

        try:
            self.embedding_model = load_embedding_model()
            print("Embedding model loaded.")
        except Exception as e:
            print(f"Warning: Embedding model could not be loaded: {e}")

        try:
            self.reranker_model = load_reranker_model()
            print("Reranker model loaded.")
        except Exception as e:
            print(f"Warning: Reranker model could not be loaded: {e}")

        print("AI Model initialization routine completed.")



model_manager = ModelManager()