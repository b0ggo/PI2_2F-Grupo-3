from flask import Flask
from flask_cors import CORS

from config import CORS_ORIGINS, DATABASE_URL, SECRET_KEY
from db.database import init_db
from routes import register_routes


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = SECRET_KEY
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app, origins=CORS_ORIGINS, supports_credentials=True)
    init_db(app)
    register_routes(app)
    return app


app = create_app()


if __name__ == "__main__":
    import os

    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=5000, debug=debug)
