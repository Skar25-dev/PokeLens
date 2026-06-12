from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base

class UserCard(Base):
    __tablename__ = "user_cards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, default=1) # default=1 minetras no hay auth
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=False)

    quantity = Column(Integer, default=1)
    condition = Column(String, default="near_mint") # mint/near_mint/excellent/good/poor
    language = Column(String, default="en")
    is_foil = Column(Integer, default=0) #0/1 (sqlite no tiene bool nativo)

    purchase_price = Column(Float, nullable=True)
    notes = Column(String, nullable=True)

    added_at = Column(DateTime(timezone=True), server_default=func.now())
    