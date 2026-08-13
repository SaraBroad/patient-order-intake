from datetime import date

from pydantic import BaseModel, ConfigDict, Field
from datetime import date

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

class OrderUpdate(BaseModel):
    patient_first_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )
    patient_last_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )
    patient_date_of_birth: date | None = None