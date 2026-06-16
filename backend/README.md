# 🎴 PokéLens - Backend

![Python](https://img.shields.io/badge/python-3.12+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57.svg)
![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4.svg)

API REST que gestiona el escaneo de cartas Pokémon con IA, consulta de precios en tiempo real y colección personal por usuario con autenticación JWT.

---

## 🚀 Descripción

El backend de PokéLens actúa como el cerebro del sistema. Recibe una foto de una carta Pokémon, la analiza con **Gemini Vision**, consulta precio y metadatos en **PokéTCG API** y gestiona la colección de cada usuario con autenticación segura mediante **JWT**.

- **Identificación por IA:** Gemini 2.5 Flash extrae nombre, set, número y rareza de la imagen.
- **Precios en tiempo real:** PokéTCG API devuelve precios de Cardmarket (EUR) y TCGPlayer (USD).
- **Colección personal:** CRUD completo de cartas por usuario con valor estimado según condición.
- **Autenticación segura:** JWT con python-jose y contraseñas hasheadas con bcrypt.

---

## ✨ Funcionalidades Clave

✅ **POST /scan:** Recibe foto → identifica carta con Gemini → devuelve datos + precios.  
✅ **GET /collection:** Colección del usuario con precios actualizados y valor total.  
✅ **POST /collection:** Guarda carta escaneada con estado, cantidad e idioma.  
✅ **DELETE /collection/{id}:** Elimina carta de la colección.  
✅ **GET /prices/{id}:** Refresca el precio de una carta concreta.  
✅ **POST /auth/register:** Registro de usuario con email y contraseña.  
✅ **POST /auth/login:** Login, devuelve JWT válido 7 días.  
✅ **GET /auth/me:** Datos del usuario autenticado.

---

## 🏗️ Pipeline de Escaneo

```text
[ Foto de la carta ]
          │
          ▼
[ Gemini 2.5 Flash ]
  → nombre, set, número, rareza, idioma
          │
          ▼
[ PokéTCG API ]
  → imagen oficial HD
  → precio Cardmarket: low / trend / avg30 (EUR)
  → precio TCGPlayer: low / mid / market (USD)
          │
          ▼
[ Respuesta JSON ]
  → listo para guardar en colección
```

---

## 📂 Estructura

```text
backend/
├── app/
│   ├── main.py                  # Entrypoint FastAPI, registra routers
│   ├── config.py                # Variables de entorno con dotenv
│   ├── database.py              # SQLAlchemy engine, session, Base
│   │
│   ├── models/
│   │   ├── card.py              # Tabla cards (metadatos de carta)
│   │   ├── user.py              # Tabla users (email, password_hash)
│   │   └── user_card.py         # Tabla user_cards (colección del usuario)
│   │
│   ├── schemas/
│   │   ├── card.py              # CardResult, CardOut (Pydantic)
│   │   └── collection.py        # UserCardCreate, UserCardOut, CollectionSummary
│   │
│   ├── routers/
│   │   ├── auth.py              # /auth/register, /auth/login, /auth/me
│   │   ├── scan.py              # POST /scan
│   │   ├── collection.py        # GET/POST/DELETE /collection
│   │   └── prices.py            # GET /prices/{pokemontcg_id}
│   │
│   ├── services/
│   │   ├── vision_ai.py         # Cliente Gemini Vision
│   │   ├── pokemontcg.py        # Cliente PokéTCG API
│   │   └── price_aggregator.py  # Valor estimado según condición
│   │
│   └── core/
│       ├── security.py          # JWT, bcrypt: hash/verify/create/decode
│       └── deps.py              # Dependencia get_current_user (FastAPI)
│
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Instalación

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edita `.env` con tus credenciales (ver sección Variables de Entorno).

---

## 🔧 Variables de Entorno
`GEMINI_API_KEY=tu_api_key`
`Gratis en https://aistudio.google.com/app/apikey`
`POKEMONTCG_API_KEY=tu_api_key`
`Opcional, sube el rate limit. Gratis en https://dev.pokemontcg.io`
`DATABASE_URL=sqlite:///./pokelens.db`
`Para producción: postgresql://user:pass@localhost:5432/pokelens`
`SECRET_KEY=cadena_aleatoria_larga`
`Genera con: python -c "import secrets; print(secrets.token_hex(32))"`

---

## 🚀 Arranque

```bash
# Solo accesible desde el PC (desarrollo)
python -m uvicorn app.main:app --reload

# Accesible desde el móvil en la misma red WiFi
python -m uvicorn app.main:app --reload --host 0.0.0.0
```

La base de datos SQLite se crea automáticamente al arrancar.  
Documentación interactiva: **http://localhost:8000/docs**

---

## 🔐 Autenticación

Todos los endpoints de `/collection` requieren JWT en el header:
Authorization: Bearer <token>

El token se obtiene al hacer `POST /auth/register` o `POST /auth/login` y es válido durante **7 días**.

Prueba rápida con curl:

```bash
# Registro
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "tu@email.com", "password": "123456", "name": "Tu nombre"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "tu@email.com", "password": "123456"}'

# Ver perfil
curl -H "Authorization: Bearer TU_TOKEN" http://localhost:8000/auth/me

# Ver colección
curl -H "Authorization: Bearer TU_TOKEN" http://localhost:8000/collection
```

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| Framework | FastAPI 0.115 |
| ORM | SQLAlchemy 2.0 |
| Base de datos | SQLite (dev) / PostgreSQL (prod) |
| IA Visión | Google Gemini 2.5 Flash |
| Precios | PokéTCG API |
| Auth | python-jose (JWT) + passlib/bcrypt |
| HTTP client | httpx (async) |
| Validación | Pydantic 2.9 |

---

## 📓 Notas

- `GET /collection` hace una petición a PokéTCG API por cada carta del usuario. Para colecciones grandes, añadir caché Redis con TTL de varias horas en `services/pokemontcg.py`.
- El código ORM es compatible con PostgreSQL sin cambios — solo actualiza `DATABASE_URL` en `.env`.
- El `SECRET_KEY` nunca debe subirse a git. Está en `.gitignore` via `.env`.

**build:** versión 1.0.0
