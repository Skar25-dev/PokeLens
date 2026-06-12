# PokéLens — Backend

## 1. Instalación

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 2. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y pon tu `GEMINI_API_KEY` (gratis en https://aistudio.google.com/app/apikey).

Necesitas `python-dotenv` cargado o exportar las variables manualmente. Para cargar el `.env`
automáticamente, instala:

```bash
pip install python-dotenv
```

Y añade al principio de `app/config.py`:
```python
from dotenv import load_dotenv
load_dotenv()
```

(O simplemente exporta las variables en tu terminal antes de arrancar.)

## 3. Arrancar el servidor

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Por defecto usa SQLite (`pokelens.db`), se crea solo al arrancar. No necesitas Postgres para empezar.

## 4. Probar

Abre http://localhost:8000/docs

### Flujo completo:

1. **POST /scan** — sube una foto → te devuelve `name`, `pokemontcg_id`, `prices`, etc.
2. **POST /collection** — envía ese mismo JSON (+ `condition`, `quantity`...) → la guarda en tu colección.
3. **GET /collection** — devuelve toda tu colección con precios actualizados y totales por rareza.
4. **DELETE /collection/{id}** — elimina una carta de la colección.
5. **GET /prices/{pokemontcg_id}** — refresca el precio de una carta concreta.

### Ejemplo con curl:

```bash
# 1. Escanear
curl -X POST "http://localhost:8000/scan" -F "file=@carta.jpg"

# 2. Añadir a colección (usa los datos devueltos por /scan)
curl -X POST "http://localhost:8000/collection" \
  -H "Content-Type: application/json" \
  -d '{
    "pokemontcg_id": "sv3-125",
    "name": "Charizard ex",
    "set_name": "Obsidian Flames",
    "number": "125/197",
    "rarity": "Double Rare",
    "image_url": "https://images.pokemontcg.io/sv3/125_hires.png",
    "quantity": 1,
    "condition": "near_mint"
  }'

# 3. Ver colección
curl "http://localhost:8000/collection"
```

## Estructura

```
app/
├── main.py              # entrypoint, monta routers
├── config.py            # variables de entorno
├── database.py          # SQLAlchemy engine/session
├── models/               # tablas (Card, User, UserCard)
├── schemas/              # Pydantic (entrada/salida API)
├── routers/              # endpoints: scan, prices, collection
└── services/             # lógica: vision_ai, pokemontcg, price_aggregator
```

## Notas

- El `user_id` está fijado a `1` (`DEFAULT_USER_ID` en `routers/collection.py`) hasta que
  implementes autenticación. Cuando añadas auth, sustituye eso por el usuario autenticado.
- `GET /collection` consulta PokéTCG API en vivo para cada carta para tener precios frescos.
  Para colecciones grandes, esto será lento — el siguiente paso natural es añadir caché (Redis)
  con TTL de unas horas en `services/pokemontcg.py`.