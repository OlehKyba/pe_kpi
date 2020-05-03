from flask import render_template
from utils import send_email
from app.extentions import celery


@celery.task
def send_async_email(email, link, subject, html_path, text_path):
    html_body = render_template(html_path, link=link)
    text_body = render_template(text_path)
    send_email(
        subject,
        recipients=[email],
        text_body=text_body,
        html_body=html_body,
    )
