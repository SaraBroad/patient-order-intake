from models import ActivityLog


def log_activity(
    db,
    action: str,
    method: str,
    path: str,
    order_id: int | None = None,
    user_id: int | None = None,
):
    log = ActivityLog(
        action=action,
        method=method,
        path=path,
        order_id=order_id,
        user_id=user_id,
    )

    db.add(log)
    db.commit()

    return log