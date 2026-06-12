from fastapi import APIRouter, UploadFile, File, HTTPException

from app.schemas.card import CardResult
from app.services import vision_ai, pokemontcg

router = APIRouter(tags=["scan"])

@router.post("/scan", response_model=CardResult)
async def scan_card(file: UploadFile = File(...)):
    """Sube una foto de una carta y devuelve identificación + precio (sin guardar)"""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")
    
    image_bytes = await file.read()

    identified = await vision_ai.identify_card(image_bytes, file.content_type)

    if not identified.get("name"):
        raise HTTPException(status_code=404, detail="No se pudo identificar la carta")
    
    card_data = await pokemontcg.search_card(
        name=identified["name"],
        number=identified.get("number"),
        set_name=identified.get("set_name"),
    )

    if not card_data:
        # Devolvemos al menos lo identificado por la IA, sin precio
        return CardResult(
            name=identified["name"],
            set_name=identified.get("set_name"),
            number=identified.get("number"),
            rarity=identified.get("rarity"),
        )
    
    return CardResult(**card_data)