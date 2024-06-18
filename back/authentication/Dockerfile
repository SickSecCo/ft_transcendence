# Dockerfile.user
FROM python:3.8

WORKDIR /usr/src/app

COPY . .

RUN apt-get update && apt-get install -y postgresql-client
RUN pip install --no-cache-dir \
    Django==3.2.8 \
    psycopg2-binary \
    djangorestframework \
    django-cors-headers \
    django-sslserver \
    django-environ \
    djangorestframework-simplejwt \
    django-trench \
    email-validator

EXPOSE 4000

ENTRYPOINT ["./entrypoint.sh"]