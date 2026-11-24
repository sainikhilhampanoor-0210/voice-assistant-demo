# Voice Assistant

The browser handles speech recognition and synthesis. The FastAPI service routes the transcript to an order lookup or policy search. The client carries the last order ID between turns.

[Try the browser demo](https://sainikhilhampanoor-0210.github.io/voice-assistant-demo/) · [Open the Python app](https://voice-assistant-demo1.onrender.com) · [Explore the API](https://voice-assistant-demo1.onrender.com/docs)

## Try it

Enter `order A1042`, then `what is its status?` to test a follow-up. In a supported browser, use the microphone to dictate a request or play the reply aloud.

## Inside the repository

- [Python service](service.py) — request validation and intent handling and conversational order context.
- [Web client](server-client.mjs) — sends requests to the Python service and displays the response.
- [Browser engine](engine.mjs) — powers the standalone GitHub Pages demo.

## Run locally

Follow the [FastAPI and Docker instructions](BACKEND.md). For the standalone browser version, run `python3 -m http.server 8000` from the repository root and open `http://localhost:8000`.

This portfolio demo uses fictional data. The hosted Python service runs on Render’s free tier and may take a moment to wake up.
