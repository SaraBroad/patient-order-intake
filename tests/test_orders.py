from datetime import date
from types import SimpleNamespace
from unittest.mock import AsyncMock

from fastapi.testclient import TestClient

from database import get_db
from main import app


client = TestClient(app)


def test_get_missing_order_returns_404():
    response = client.get("/api/v1/orders/999999")

    assert response.status_code == 404


def test_upload_rejects_non_pdf():
    response = client.post(
        "/api/v1/orders/upload",
        files={
            "file": (
                "test.txt",
                b"hello",
                "text/plain",
            )
        },
    )

    assert response.status_code == 400


def test_upload_pdf_success(monkeypatch):
    fake_order = SimpleNamespace(
        id=1,
        patient_first_name="Marie",
        patient_last_name="Curie",
        patient_date_of_birth=date(1900, 12, 5),
        source_filename="patient.pdf",
    )

    mock_create_order = AsyncMock(return_value=fake_order)

    monkeypatch.setattr(
        "routers.orders.create_order_from_document",
        mock_create_order,
    )

    response = client.post(
        "/api/v1/orders/upload",
        files={
            "file": (
                "patient.pdf",
                b"%PDF-1.4 fake pdf bytes",
                "application/pdf",
            )
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 1
    assert data["patient_first_name"] == "Marie"
    assert data["patient_last_name"] == "Curie"
    assert data["patient_date_of_birth"] == "1900-12-05"
    assert data["source_filename"] == "patient.pdf"


def test_get_order_success():
    fake_order = SimpleNamespace(
        id=1,
        patient_first_name="Marie",
        patient_last_name="Curie",
        patient_date_of_birth=date(1900, 12, 5),
        source_filename="patient.pdf",
    )

    class FakeDB:
        def get(self, model, order_id):
            return fake_order

        def add(self, obj):
            pass

        def commit(self):
            pass

    def override_get_db():
        yield FakeDB()

    app.dependency_overrides[get_db] = override_get_db

    try:
        response = client.get("/api/v1/orders/1")

        assert response.status_code == 200

        data = response.json()

        assert data["id"] == 1
        assert data["patient_first_name"] == "Marie"
        assert data["patient_last_name"] == "Curie"
        assert data["patient_date_of_birth"] == "1900-12-05"

    finally:
        app.dependency_overrides.clear()

    fake_order = SimpleNamespace(
        id=1,
        patient_first_name="Marie",
        patient_last_name="Curie",
        patient_date_of_birth=date(1900, 12, 5),
        source_filename="patient.pdf",
    )

    class FakeDB:
        def get(self, model, order_id):
            return fake_order

        def add(self, obj):
            pass

        def commit(self):
            pass

        def override_get_db():
            yield FakeDB()

    app.dependency_overrides[get_db] = override_get_db

    try:
        response = client.get("/api/v1/orders/1")

        assert response.status_code == 200

        data = response.json()

        assert data["id"] == 1
        assert data["patient_first_name"] == "Marie"
        assert data["patient_last_name"] == "Curie"
        assert data["patient_date_of_birth"] == "1900-12-05"

    finally:
        app.dependency_overrides.clear()

def test_upload_returns_422_when_extraction_fails(monkeypatch):
    mock_create_order = AsyncMock(
        side_effect=ValueError(
            "Required patient information could not be extracted"
        )
    )

    monkeypatch.setattr(
        "routers.orders.create_order_from_document",
        mock_create_order,
    )

    response = client.post(
        "/api/v1/orders/upload",
        files={
            "file": (
                "patient.pdf",
                b"%PDF-1.4 fake pdf bytes",
                "application/pdf",
            )
        },
    )

    assert response.status_code == 422
    assert response.json()["detail"] == (
        "Required patient information could not be extracted"
    )

def test_upload_returns_503_when_llm_unavailable(monkeypatch):
    mock_create_order = AsyncMock(
        side_effect=RuntimeError(
            "Document extraction service is temporarily unavailable"
        )
    )

    monkeypatch.setattr(
        "routers.orders.create_order_from_document",
        mock_create_order,
    )

    response = client.post(
        "/api/v1/orders/upload",
        files={
            "file": (
                "patient.pdf",
                b"%PDF-1.4 fake pdf bytes",
                "application/pdf",
            )
        },
    )

    assert response.status_code == 503
    assert response.json()["detail"] == (
        "Document extraction service is temporarily unavailable"
    )