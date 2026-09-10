from collections import defaultdict
from datetime import date

from schemas import DuplicatePatientCluster


def _normalize_name(value: str) -> str:
    return " ".join(value.split()).casefold()


def _dob_iso(value: date | str) -> str:
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return str(value)


def _identity_key(order) -> str:
    return "|".join(
        (
            _normalize_name(order.patient_first_name),
            _normalize_name(order.patient_last_name),
            _dob_iso(order.patient_date_of_birth),
        )
    )


def find_duplicate_patient_clusters(orders) -> list[DuplicatePatientCluster]:
    groups: dict[str, list] = defaultdict(list)

    for order in orders:
        groups[_identity_key(order)].append(order)

    clusters: list[DuplicatePatientCluster] = []

    for group in groups.values():
        if len(group) < 2:
            continue

        canonical = min(group, key=lambda order: order.id)
        order_ids = sorted(order.id for order in group)

        clusters.append(
            DuplicatePatientCluster(
                patient_first_name=canonical.patient_first_name,
                patient_last_name=canonical.patient_last_name,
                patient_date_of_birth=canonical.patient_date_of_birth,
                count=len(group),
                order_ids=order_ids,
            )
        )

    clusters.sort(
        key=lambda cluster: (
            -cluster.count,
            cluster.patient_last_name,
            cluster.patient_first_name,
        )
    )

    return clusters
