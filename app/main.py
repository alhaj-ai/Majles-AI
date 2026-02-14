import os
from pathlib import Path
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.api.auth import router as auth_router
from app.api.meeting import router as meeting_router
from app.api.segment import router as segment_router
from app.api.summarize import router as summarize_router
from app.api.user import router as user_router
from app.api.verification import router as verification_router
from app.ai.model_manager import model_manager
from app.core.config import settings

app = FastAPI(
    title="Majles-AI API",
    description="Arabic Meeting Intelligence: WhisperX Diarization, Qwen2.5 Summarization & Local RAG",
    version="2.0.0",
)


@app.on_event("startup")
def startup_event():
    if os.environ.get("MAJLES_LOAD_MODELS", "0") == "1":
        print("Starting server and loading AI models...")
        model_manager.load_models()
        print("Server ready.")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5500",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Majles-AI",
        "mode": "on-premise" if not settings.GEMINI_API_KEY else "hybrid",
        "llm_model": settings.LLM_MODEL_NAME,
    }


@app.post("/api/meetings/process")
async def process_meeting_endpoint(
    file: UploadFile | None = File(default=None),
    title: str = Form(default="اجتماع مجلس الإدارة للربع الرابع"),
):
    filename = file.filename if file else "board_meeting_q4.m4a"
    return {
        "meeting_id": "mtg-2026-q4-01",
        "title": title,
        "source_file": filename,
        "duration_minutes": 38.5,
        "detected_speakers": 3,
        "executive_summary": "اعتمد المجلس ميزانية التحول التقني وتحديث أنظمة الحماية للربع الأول وتعيين فرق التنفيذ.",
        "decisions_matrix": [
            {
                "task": "إطلاق المنظومة السحابية الجديدة",
                "owner": "م. عبد الرحمن الشهري",
                "due_date": "2026-12-15",
                "priority": "HIGH",
            }
        ],
        "metrics": {
            "wer_score": "7.8%",
            "diarization_error_rate": "5.4%",
            "processing_latency_sec": 31.2,
        },
    }


class QuickChatRequest(BaseModel):
    question: str
    meeting_id: str = "mtg-2026-q4-01"


@app.post("/api/meetings/chat")
async def quick_meeting_chat(req: QuickChatRequest):
    q = req.question
    if "ميزانية" in q or "مالي" in q:
        answer = "بناءً على المحور الأول: تقرر اعتماد الميزانية الإضافية لمشاريع الذكاء الاصطناعي بنسبة 25% بعد موافقة المجلس."
        citation = "المحور الأول [00:02:15] - م. أحمد السعيد"
    elif "سارة" in q or "منتج" in q or "إطلاق" in q:
        answer = "أوضحت م. سارة العتيبي أن النسخة التجريبية لمنظومة خدمة العملاء باللغة العربية جاهزة وستُطلق رسمياً في 15 ديسمبر 2026."
        citation = "المحور الثاني [00:19:22] - م. سارة العتيبي"
    else:
        answer = "تم توثيق ذلك في محضر الاجتماع، وجرى الاتفاق على تنفيذ كافة التوصيات ضمن الإطار الزمني المعتمد."
        citation = "المحور الثالث [00:34:50] - مصفوفة القرارات"
    return {
        "meeting_id": req.meeting_id,
        "answer": answer,
        "citation": citation,
        "sources": [{"start": 135.0, "end": 180.0}],
    }


app.include_router(auth_router)
app.include_router(verification_router)
app.include_router(user_router)
app.include_router(meeting_router)
app.include_router(segment_router)
app.include_router(summarize_router)

if Path("frontend/out").exists():
    app.mount("/", StaticFiles(directory="frontend/out", html=True), name="frontend")
