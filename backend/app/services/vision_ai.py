import json

import google.generativeai as genai
from fastapi import HTTPException

from app.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
_model = genai.GenerativeModel("gemini-2.5-flash")

IDENTIFY_PROMPT = """Eres un experto en cartas de Pokémon TCG.
                    Analiza esta imagen y devuelve EXCLUSIVAMENTE un JSON (sin texto adicional, sin markdown), con esta estructura:
                    {
                    "name": "Nombre del Pokémon o carta tal y como aparece",
                    "set_name": "Nombre del set si lo identificas, o null",
                    "number": "Número de carta tal como aparece (ej: 25/102), o null",
                    "rarity": "Rareza visible en la carta si la distingues, o null",
                    "language": "Idioma del texto de la carta (en, es, ja, etc.)"                  
                    }
                    Si no puedes identificar la carta con confianza devuelve "name": null.
                """

async def identify_card(image_bytes: bytes, mime_type: str) -> dict:
    """Envía la imagen a Gemini Vision y devuelve los datos identificados."""
    image_part = {"mime_type": mime_type, "data": image_bytes}

    response = _model.generate_content([IDENTIFY_PROMPT, image_part])

    text = response.text.strip()
    text = text.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=422,
            detail=f"No se pudo parsear respuesta de IA: {text}",
        )