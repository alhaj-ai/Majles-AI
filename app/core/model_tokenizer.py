import os

TOKENIZER_PATH = os.path.join(os.path.dirname(__file__), "model_tokenizer")
try:
    from transformers import AutoTokenizer

    if os.path.exists(TOKENIZER_PATH) and os.path.exists(os.path.join(TOKENIZER_PATH, "tokenizer.json")):
        tokenizer = AutoTokenizer.from_pretrained(TOKENIZER_PATH, local_files_only=True)
    else:
        tokenizer = None
except Exception:
    tokenizer = None
