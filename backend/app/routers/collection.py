from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.card import Card
from app.models.user_card import UserCard
from app.schemas.collection import UserCardCreate, UserCardOut, CollectionSummary
from app.schemas.card import CardOut
from app.services import pokemontcg, price_aggregator


router = APIRouter(prefix="/collection", tags=["collection"])

DEFAULT_USER_ID = 1 # hasta que haya auth real

def _get_or_create_card(db: Session, data: UserCardCreate) -> Card:
    """Busca la carta en BD por pokemontcg_id; si no existe, la crea."""
    card = None
    if data.pokemontcg_id:
        card = db.query(Card).filter(Card.pokemontcg_id == data.pokemontcg_id).first()
    
    if card:
        return card
    
    card = Card(
        pokemontcg_id=data.pokemontcg_id,
        name=data.name,
        set_name=data.set_name,
        number=data.number,
        rarity=data.rarity,
        image_url=data.image_url,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card

async def _build_user_card_out(db: Session, uc: UserCard) -> UserCardOut:
    """Convierte un UserCard de BD en el schema de salida, añadiendo precio actual."""
    card: Card = uc.card if hasattr(uc, "card") else db.query(Card).get(uc.card_id)

    prices = None
    if card.pokemontcg_id:
        live = await pokemontcg.get_card_by_id(card.pokemontcg_id)
        if live:
            prices = live.get("prices")
    
    estimated_value = price_aggregator.estimate_value(prices, uc.condition, uc.quantity)

    return UserCardOut(
        id=uc.id,
        quantity=uc.quantity,
        condition=uc.condition,
        language=uc.language,
        is_foil=bool(uc.is_foil),
        purchase_price=uc.purchase_price,
        notes=uc.notes,
        card=CardOut.model_validate(card),
        current_price=prices,
        estimated_value=estimated_value,
    )
@router.post("", response_model=UserCardOut)
async def add_to_collection(data: UserCardCreate, db: Session = Depends(get_db)):
    """Añade una carta (escaneada o manual) a la colección del usuario."""
    card = _get_or_create_card(db, data)
 
    user_card = UserCard(
        user_id=DEFAULT_USER_ID,
        card_id=card.id,
        quantity=data.quantity,
        condition=data.condition,
        language=data.language,
        is_foil=int(data.is_foil),
        purchase_price=data.purchase_price,
        notes=data.notes,
    )
    db.add(user_card)
    db.commit()
    db.refresh(user_card)
    user_card.card = card  # para evitar query extra en _build_user_card_out
 
    return await _build_user_card_out(db, user_card)
 
@router.get("", response_model=CollectionSummary)
async def get_collection(db: Session = Depends(get_db)):
    """Devuelve toda la colección del usuario con precios actuales y totales."""
    user_cards = (
        db.query(UserCard)
        .filter(UserCard.user_id == DEFAULT_USER_ID)
        .all()
    )
 
    items = []
    total_value = 0.0
    by_rarity: dict[str, dict] = {}
 
    for uc in user_cards:
        item = await _build_user_card_out(db, uc)
        items.append(item)
 
        value = item.estimated_value or 0.0
        total_value += value
 
        rarity = item.card.rarity or "Sin rareza"
        if rarity not in by_rarity:
            by_rarity[rarity] = {"count": 0, "value": 0.0}
        by_rarity[rarity]["count"] += item.quantity
        by_rarity[rarity]["value"] = round(by_rarity[rarity]["value"] + value, 2)
 
    return CollectionSummary(
        total_cards=sum(i.quantity for i in items),
        total_value_eur=round(total_value, 2),
        by_rarity=by_rarity,
        items=items,
    )
 
 
@router.delete("/{user_card_id}")
def remove_from_collection(user_card_id: int, db: Session = Depends(get_db)):
    """Elimina una carta de la colección del usuario."""
    user_card = (
        db.query(UserCard)
        .filter(UserCard.id == user_card_id, UserCard.user_id == DEFAULT_USER_ID)
        .first()
    )
 
    if not user_card:
        raise HTTPException(status_code=404, detail="Carta no encontrada en la colección")
 
    db.delete(user_card)
    db.commit()
    return {"status": "deleted", "id": user_card_id}