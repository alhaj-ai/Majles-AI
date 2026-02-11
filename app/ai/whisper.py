from app.core.config import settings

try:
    import torch
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
except Exception:
    DEVICE = "cpu"


def load_whisper():
    import torch
    from transformers import WhisperForConditionalGeneration, WhisperProcessor
    from huggingface_hub import login

    if settings.HF_TOKEN:
        login(settings.HF_TOKEN)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    processor = WhisperProcessor.from_pretrained(settings.WHISPER_MODEL_PATH)
    model = WhisperForConditionalGeneration.from_pretrained(
        settings.WHISPER_MODEL_PATH,
        dtype=torch.float16 if device == "cuda" else torch.float32,
    )
    model.to(device)
    model.eval()
    return {
        "model": model,
        "processor": processor,
    }
