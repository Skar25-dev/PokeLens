import httpx

from app.config import settings

BASE_URL = "https://api.pokemontcg.io/v2/cards"

def _extract_prices(card: dict) -> dict:
    prices = {}

    cardmarket = card.get("cardmarket", {}).get("prices", {})
    if cardmarket:
        prices["cardmarket"] = {
            "low": cardmarket.get("lowPrice"),
            "trend": cardmarket.get("trendPrice"),
            "avg30": cardmarket.get("avg30"),
            "currency": "EUR",
        }
    
    tcgplayer = card.get("tcgplayer", {}).get("prices", {})

    if tcgplayer:
        variant = next(iter(tcgplayer.values()), {})
        prices["tcgplayer"] = {
            "low": variant.get("low"),
            "mid": variant.get("mid"),
            "market": variant.get("market"),
            "currency": "USD",
        }

    return prices

def _card_to_dict(card: dict) -> dict:
    return {
        "name": card.get("name"),
        "set_name": card.get("set", {}).get("name"),
        "number": card.get("number"),
        "rarity": card.get("rarity"),
        "image_url": card.get("images", {}).get("large") or card.get("images", {}).get("small"),
        "pokemontcg_id": card.get("id"),
        "prices": _extract_prices(card),
    }

async def search_card(name: str, number: str | None = None, set_name: str | None = None) -> dict | None:
    """Busca una carta por nombre (+ opcional número/set y devuelve datos + precios)"""
    query_parts = [f'name:"{name}"']
    if number:
        clean_number = number.split("/")[0].strip()
        query_parts.append(f"number:{clean_number}")
    
    query = " ".join(query_parts)

    headers = {}
    if settings.POKEMONTCG_API_KEY:
        headers["X-Api-Key"] = settings.POKEMONTCG_API_KEY
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            BASE_URL,
            params={"q": query, "pageSize": 5},
            headers=headers,
            timeout=10.0,
        )
    
    if resp.status_code != 200:
        return None
    
    data = resp.json().get("data", [])
    if not data:
        return None
    
    card = data[0]
    if set_name:
        for c in data:
            if set_name.lower() in c.get("set", {}).get("name", "").lower():
                card = c
                break
    return _card_to_dict(card)

async def get_card_by_id(pokemontcg_id: str) -> dict | None:
    """Obtiene una carta concreta por su ID de PokéTCG (para refrescar precios)."""
    headers = {}
    if settings.POKEMONTCG_API_KEY:
        headers["X-Api-Key"] = settings.POKEMONTCG_API_KEY
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{BASE_URL}/{pokemontcg_id}", headers=headers, timeout=10.0)

        if resp.status_code != 200:
            return None

        card = resp.json().get("data")
        if not card:
            return None
        
        return _card_to_dict