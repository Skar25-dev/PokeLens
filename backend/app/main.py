from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import scan, prices, collection

# Crea las tablas si no existen (para MVP; en producción usar Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PokéLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # restringe en producción
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router)
app.include_router(prices.router)
app.include_router(collection.router)

@app.get("/")
async def root():
    return {"status": "ok", "service": "PokéLens API"}