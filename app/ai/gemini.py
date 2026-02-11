from app.core.config import settings


def _get_client():
    if not settings.GEMINI_API_KEY:
        return None
    from google import genai
    return genai.Client(api_key=settings.GEMINI_API_KEY)


def rewrite_query(query: str, history: str) -> str:
    if not history.strip():
        return query.strip()
    client = _get_client()
    if client is None:
        return query.strip()

    prompt = f"""
    أنت نظام يعالج الأسئلة لاستخدامها في البحث ضمن نظام RAG.

    المحادثة السابقة:
    {history}

    السؤال الحالي:
    {query}

    المطلوب:
    1. إذا كان السؤال يعتمد على السياق السابق، أعد صياغته ليصبح مستقلاً.
    2. إذا كان السؤال مستقلاً، أعده كما هو.
    3. لا تضف أي معلومات غير موجودة في السؤال أو المحادثة.
    4. أعد السؤال المعاد صياغته فقط.

    السؤال المعاد صياغته:
    """
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    return response.text.strip()


def generate_answer(chunks: list[dict], question: str) -> dict:
    client = _get_client()
    if client is None:
        from app.services.rag.generation import generate_answer as local_generate_answer
        return local_generate_answer(chunks=chunks, question=question)

    context = "".join(f"{chunk['text']}\n\n" for chunk in chunks)
    prompt = f"""
    أنت مساعد يجيب عن أسئلة حول اجتماع قد كان موجود ضمنه.
    - أجب اعتمادًا على النص المرفق فقط.
    - إذا لم تكن الإجابة موجودة في النص فقل: "لم يتم ذكر مثل هذه المعلومة في الاجتماع."

    محتوى الاجتماع:
    {context}

    السؤال:
    {question}
    """
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    answer = response.text.strip()
    sources = [{"start": chunk["start"], "end": chunk["end"]} for chunk in chunks]
    return {"answer": answer, "sources": sources}
