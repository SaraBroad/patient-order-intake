from fastapi import FastAPI

from database import Base, engine

import models

from routers.orders import router as orders_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GenHealth Assessment API",
    version="1.0.0",
)

app.include_router(
    orders_router,
    prefix="/api/v1/orders",
    tags=["orders"],
)

@app.get("/health")
def health():
    return {"status": "healthy"}