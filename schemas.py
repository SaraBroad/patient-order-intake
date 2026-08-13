from datetime import date

from pydantic import BaseModel, ConfigDict

class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    patient_first_name: str
    patient_last_name: str
    patient_date_of_birth: date
    source_filename: str | None


class ExtractedPatientData(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date