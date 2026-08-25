import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine

import models

from routers.orders import router as orders_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Patient Order Intake API",
    version="1.0.0",
)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins if origin.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    orders_router,
    prefix="/api/v1/orders",
    tags=["orders"],
)

@app.get("/health")
def health():
    return {"status": "healthy"}