from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)


def init_db(app):
    db.init_app(app)
    with app.app_context():
        from db import models  # noqa: F401
        db.create_all()
        db.session.execute(
            db.text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS foto_perfil TEXT NOT NULL DEFAULT ''"
            )
        )
        db.session.commit()
