import os
from pathlib import Path

import httpx
from mcp.server.mcpserver import MCPServer

server = MCPServer("patient-order-intake")

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")


@server.tool(
    title="Upload Document",
    description=(
        "Upload a PDF document and extract patient information from it. "
        "Reads the PDF at the given path, sends it to the GenHealth backend, "
        "which uses AI to extract the patient's first name, last name, and "
        "date of birth. Persists an order record and returns all extracted "
        "patient data."
    ),
)
def upload_document(file_path: str) -> dict:
    """
    Args:
        file_path: Absolute or relative path to the PDF file on disk.

    Returns:
        Order record with id, patient_first_name, patient_last_name,
        patient_date_of_birth, and source_filename.
    """
    path = Path(file_path).expanduser().resolve()

    if not path.exists():
        raise FileNotFoundError(f"No file found at: {path}")

    if path.suffix.lower() != ".pdf":
        raise ValueError(f"File must be a PDF, got: {path.suffix!r}")

    file_bytes = path.read_bytes()

    with httpx.Client(timeout=60.0) as client:
        response = client.post(
            f"{BACKEND_URL}/api/v1/orders/upload",
            files={"file": (path.name, file_bytes, "application/pdf")},
        )

    detail = None
    try:
        detail = response.json().get("detail")
    except Exception:
        pass

    if response.status_code == 400:
        raise ValueError(detail or "Invalid file — only PDFs are supported")
    if response.status_code == 422:
        raise ValueError(detail or "Required patient information could not be extracted")
    if response.status_code == 503:
        raise RuntimeError(detail or "Extraction service is temporarily unavailable")

    response.raise_for_status()
    return response.json()


if __name__ == "__main__":
    server.run()
