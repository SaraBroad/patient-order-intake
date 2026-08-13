from datetime import datetime

from models import Order
from services.document_extractor import extract_patient_data


async def create_order_from_document(file, db):
    file_bytes = await file.read()

    patient = extract_patient_data(
        file_bytes=file_bytes,
        filename=file.filename,
    )

    order = Order(
        patient_first_name=patient.first_name,
        patient_last_name=patient.last_name,
        patient_date_of_birth=patient.date_of_birth,
        source_filename=file.filename,
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return order