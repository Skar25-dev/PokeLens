from sqlalchemy import Column, Integer, String

from app.database import Base

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    pokemontcg_id = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, nullable=False)
    set_name = Column(String, nullable=True)
    number = Column(String, nullable=True)
    rarity = Column(String, nullable=True)
    image_url = Column(String, nullable=True)