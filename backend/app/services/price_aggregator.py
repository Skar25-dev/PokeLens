# Multiplicadores aproximados sobre el precio de mercado según el estado de la carta
CONDITION_MULTIPLIERS = {
    "mint": 1.0,
    "near_mint": 0.85,
    "excellent": 0.65,
    "good": 0.40,
    "poor": 0.20
}

def estimate_value(prices: dict | None, condition: str = "near_mint", quantity: int = 1) -> float | None:
    """Estima el valor en EUR de una carta segúnsu condición y cantidad.
       
       Prioriza el precio 'trend' de Cardmarket; si no exite, usa 'low';
       si tampoco, intenta convertir tcgplayer 'market' (USD) de forma aproximada.
    """
    if not prices:
        return None
    
    base_price = None

    cardmarket = prices.get("cardmarket")
    if cardmarket:
        base_price = cardmarket.get("trend") or cardmarket.get("low") or cardmarket.get("avg30")
    
    if base_price is None:
        tcgplayer = prices.get("tcgplayer")
        if tcgplayer:
            usd_price = tcgplayer.get("market") or tcgplayer.get("mid") or tcgplayer.get("low")
            if usd_price is not None:
                # conversión aproximada USD -> EUR (ajustar con tasa real)
                base_price = usd_price * 0.92
    
    if base_price is None:
        return None
    
    multiplier = CONDITION_MULTIPLIERS.get(condition, 0.85)
    return round(base_price * multiplier * quantity, 2)