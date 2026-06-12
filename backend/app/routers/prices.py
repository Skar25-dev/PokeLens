from fastapi import APIRouter, HTTPException

from app.services import pokemontcg

router = APIRouter(prefix="/prices", tags=["prices"])

@router.get("/{pokemontcg_id}")
async def get_price(pokemontcg_id: str):
    "Devuelve el precio acutalizado de una carta por su ID de PokéTCG"
    card_data = await pokemontcg.get_card_by_id(pokemontcg_id)

    if not card_data:
        raise HTTPException(status_code=404, detail="Carta no encontrada")

    return {
        "pokemontcg_id": card_data["pokemontcg_id"],
        "name": card_data["name"],
        "prices": card_data["prices"],
    }