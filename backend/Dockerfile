FROM python:3.7.3-slim
# slim=debian-based. Not using alpine because it has poor python3 support.

RUN apt-get update && apt-get install -y libpq-dev gcc
# need gcc to compile psycopg2

WORKDIR /app
COPY requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt

RUN apt-get autoremove -y gcc
COPY . /app

EXPOSE 5000
