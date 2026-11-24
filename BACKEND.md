# Python service

Run from the repository root with Python 3.12:

```sh
python -m pip install -r requirements.txt
python -m uvicorn service:app --host 0.0.0.0 --port 8000
```

Open http://localhost:8000 for the interactive client, /docs for the request schema and /health for readiness. Docker: `docker build -t portfolio-demo . && docker run --rm -p 8000:8000 portfolio-demo`.

Uses browser speech recognition and synthesis where supported, typed fallback, and a Python intent router with order context carried by the client. Microphone access requires localhost or HTTPS and browser permission. Speech recognition may use the browser vendor’s service.

Independent portfolio implementation using fictional data. No hosted LLM, private company system, or cloud credentials required. Static hosting continues to use the browser implementation.
