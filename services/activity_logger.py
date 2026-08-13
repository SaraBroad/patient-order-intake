from sqlalchemy.exc import SQLAlchemyError

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

    try:
        db.add(log)
        db.commit()

    except SQLAlchemyError:
        db.rollback()
        raise

    return log