"""Server-only Gemini adapter. No client or credential is created at import time."""
from google import genai
from google.genai import types

DEFAULT_MODEL = 'gemini-3.8-flash'
MODELS = {
    DEFAULT_MODEL: 'Gemini 3.8 Flash',
    'gemini-3.5-flash-lite': 'Gemini 3.5 Flash-Lite',
}

def generate_content(api_key, model, contents, *, timeout_ms=20000, max_output_tokens=8192):
    if not api_key:
        raise ValueError('Provider is not configured')
    if model not in MODELS:
        raise ValueError('Select a supported model')
    # Preserve temperature=1.0; bound time, output and attempts per user action.
    with genai.Client(api_key=api_key,
                      http_options=types.HttpOptions(api_version='v1', timeout=min(timeout_ms,20000), retry_options=types.HttpRetryOptions(attempts=1))) as client:
        return client.models.generate_content(
            model=model, contents=contents,
            config=types.GenerateContentConfig(temperature=1.0, max_output_tokens=min(max_output_tokens,8192)),
        )
