"""Inicializa as tabelas no PostgreSQL."""
from app import create_app
from db.database import db


def main():
    app = create_app()
    with app.app_context():
        db.create_all()
        print("Tabelas criadas/verificadas com sucesso.")


if __name__ == "__main__":
    main()
