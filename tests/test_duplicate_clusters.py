from datetime import date
from types import SimpleNamespace

from database import get_db
from main import app
from fastapi.testclient import TestClient

from services.duplicate_clusters import find_duplicate_patient_clusters


client = TestClient(app)


def _order(
    order_id: int,
    first: str,
    last: str,
    dob: date,
):
    return SimpleNamespace(
        id=order_id,
        patient_first_name=first,
        patient_last_name=last,
        patient_date_of_birth=dob,
    )


def test_no_duplicates_returns_empty_list():
    orders = [
        _order(1, "Marie", "Curie", date(1900, 12, 5)),
        _order(2, "Ada", "Lovelace", date(1815, 12, 10)),
    ]

    assert find_duplicate_patient_clusters(orders) == []


def test_pair_with_different_casing_and_spaces_is_one_group():
    orders = [
        _order(5, "Marie", "Curie", date(1900, 12, 5)),
        _order(2, "  marie", "curie  ", date(1900, 12, 5)),
    ]

    clusters = find_duplicate_patient_clusters(orders)

    assert len(clusters) == 1
    cluster = clusters[0]
    assert cluster.count == 2
    assert cluster.order_ids == [2, 5]
    assert cluster.patient_first_name == "  marie"
    assert cluster.patient_last_name == "curie  "
    assert cluster.patient_date_of_birth == date(1900, 12, 5)


def test_triple_is_one_group_with_count_three():
    dob = date(1900, 12, 5)
    orders = [
        _order(9, "MARIE", "Curie", dob),
        _order(2, "marie", "curie", dob),
        _order(5, "Marie", "Curie", dob),
    ]

    clusters = find_duplicate_patient_clusters(orders)

    assert len(clusters) == 1
    assert clusters[0].count == 3
    assert clusters[0].order_ids == [2, 5, 9]


def test_same_dob_different_names_are_not_grouped():
    dob = date(1900, 12, 5)
    orders = [
        _order(1, "Marie", "Curie", dob),
        _order(2, "Ada", "Lovelace", dob),
        _order(3, "Marie", "Curie", dob),
    ]

    clusters = find_duplicate_patient_clusters(orders)

    assert len(clusters) == 1
    assert clusters[0].patient_first_name == "Marie"
    assert clusters[0].order_ids == [1, 3]


def test_display_names_come_from_smallest_id():
    dob = date(1815, 12, 10)
    orders = [
        _order(10, "ADA", "LOVELACE", dob),
        _order(4, "Ada", "Lovelace", dob),
    ]

    clusters = find_duplicate_patient_clusters(orders)

    assert clusters[0].patient_first_name == "Ada"
    assert clusters[0].patient_last_name == "Lovelace"


def test_get_duplicates_endpoint_returns_200():
    class FakeResult:
        def all(self):
            return []

    class FakeDB:
        def scalars(self, statement):
            return FakeResult()

        def add(self, obj):
            pass

        def commit(self):
            pass

    def override_get_db():
        yield FakeDB()

    app.dependency_overrides[get_db] = override_get_db

    try:
        response = client.get("/api/v1/orders/duplicates")

        assert response.status_code == 200
        assert response.json() == []
    finally:
        app.dependency_overrides.clear()
