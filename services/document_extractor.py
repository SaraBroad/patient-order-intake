import base64
import os

from dotenv import load_dotenv
from openai import OpenAI

from schemas import ExtractedPatientData


load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_patient_data(
    file_bytes: bytes,
    filename: str,
) -> ExtractedPatientData:
    encoded_file = base64.b64encode(file_bytes).decode("utf-8")

    response = client.responses.parse(
        model="gpt-5.6-terra",
        input=[
           {
            "role": "system",
            "content": (
                "Extract the patient's first name, last name, and date of birth "
                "from the medical document. "
                "For date of birth, copy the date exactly as shown in the document "
                "before normalizing it to YYYY-MM-DD. Preserve the four-digit year exactly. "
                "Do not infer, estimate, or alter any digits."
            ),
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_file",
                        "filename": filename,
                        "file_data": (
                            f"data:application/pdf;base64,{encoded_file}"
                        ),
                    },
                    {
                        "type": "input_text",
                        "text": "Extract the required patient demographic fields.",
                    },
                ],
            },
        ],
        text_format=ExtractedPatientData,
    )

    if response.output_parsed is None:
        raise ValueError("Unable to extract patient data")

    return response.output_parsed