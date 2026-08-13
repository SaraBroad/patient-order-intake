from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import Order
from schemas import OrderResponse
from services.order_service import create_order_from_document
from services.activity_logger import log_activity

router = APIRouter()


@router.get("/", response_model=list[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    orders = db.scalars(select(Order)).all()

    log_activity(
        db=db,
        action="ORDERS_LIST_VIEWED",
        method="GET",
        path="/api/v1/orders",
    )

    return orders


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    order = db.get(Order, order_id)

    if order is None:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    log_activity(
        db=db,
        action="ORDER_VIEWED",
        method="GET",
        path=f"/api/v1/orders/{order_id}",
        order_id=order.id,
    )

    return order


@router.post("/upload", response_model=OrderResponse)
async def upload_order(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported",
        )

    order = await create_order_from_document(
        file=file,
        db=db,
    )

    log_activity(
        db=db,
        action="ORDER_UPLOADED",
        method="POST",
        path="/api/v1/orders/upload",
        order_id=order.id,
    )

    return order