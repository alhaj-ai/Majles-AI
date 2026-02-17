from fastapi.testclient import TestClient

from app.main import app
from app.services.rag.chunk import create_chunks
from app.services.segment_services import calculate_params

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Majles-AI"
    assert data["mode"] == "on-premise"


def test_process_meeting_endpoint():
    response = client.post(
        "/api/meetings/process",
        data={"title": "اجتماع مجلس الإدارة للربع الرابع"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["meeting_id"] == "mtg-2026-q4-01"
    assert "decisions_matrix" in data
    assert len(data["decisions_matrix"]) >= 1


def test_quick_meeting_chat():
    response = client.post(
        "/api/meetings/chat",
        json={"question": "ما هي ميزانية الذكاء الاصطناعي؟", "meeting_id": "mtg-2026-q4-01"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "25%" in data["answer"]
    assert "sources" in data


def test_chunking_and_token_params():
    segments = [
        {"start": 0.0, "end": 5.0, "text": "مرحباً بالجميع في اجتماع مجلس الإدارة"},
        {"start": 5.0, "end": 12.0, "text": "نناقش اليوم خطة التحول التقني والذكاء الاصطناعي"},
    ]
    chunks = create_chunks(segments)
    assert len(chunks) >= 1
    assert getattr(chunks[0], "start_time", getattr(chunks[0], "start", 0.0)) == 0.0

    num_predict, num_ctx = calculate_params("نص اجتماع تجريبي", "نظام تقسيم المحاور")
    assert num_predict > 0
    assert num_ctx >= 512
