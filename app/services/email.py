from app.core.config import settings


def _get_mail_client():
    from fastapi_mail import ConnectionConfig, FastMail

    conf = ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_STARTTLS=settings.MAIL_STARTTLS,
        MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
        MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
        USE_CREDENTIALS=bool(settings.MAIL_PASSWORD),
    )
    return FastMail(conf)


async def send_email(recipients: list[str], subject: str, body: str) -> None:
    from fastapi_mail import MessageSchema, MessageType

    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=body,
        subtype=MessageType.plain,
    )
    fm = _get_mail_client()
    await fm.send_message(message)


async def send_verification_email(email: str, code: str) -> None:
    body = f"""
    Hello,

    Welcome to Majles-AI!

    Your verification code is:

    {code}

    This code expires in 10 minutes.

    If you didn't create this account,
    please ignore this email.

    Majles-AI Team
    """
    await send_email(
        recipients=[email],
        subject="Verify your Majles-AI account",
        body=body,
    )
