async function ask(query, previous_order = null) {
  const response = await fetch('/api/query', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({query, previous_order})});
  if (!response.ok) throw new Error("Service returned " + response.status);
  return response.json();
}
import { voice } from './engine.mjs';
const mic = document.querySelector('#mic');
const speak = document.querySelector('#speak');
const status = document.querySelector('#voice-status');
const input = document.querySelector('#voice-input');
let previousOrder;
let reply;
input.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const resultBox = event.currentTarget.querySelector('output');
  try {
  if (!input.value.trim()) return;
  const result = await ask(input.value.trim(), previousOrder);
  previousOrder = result.orderId ?? previousOrder;
  reply = result.answer;
  input.form.querySelector('output').textContent = reply;
  speak.disabled = !('speechSynthesis' in window);
  } catch { resultBox.textContent = 'The service is unavailable. Please try again.'; }
});

const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  mic.disabled = true;
  status.textContent = 'Microphone input is unavailable in this browser.';
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
    input.form.requestSubmit();
    status.textContent = '';
  };
  recognition.onerror = () => { status.textContent = 'Could not capture speech. Try typing your message.'; };
  recognition.onend = () => {
    mic.disabled = false;
    if (status.textContent === 'Listening…') status.textContent = 'No speech captured.';
  };
  mic.addEventListener('click', () => {
    try {
      recognition.start();
      mic.disabled = true;
      status.textContent = 'Listening…';
    } catch {
      status.textContent = 'Could not start the microphone.';
    }
  });
}
speak.addEventListener('click', () => {
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(reply));
});