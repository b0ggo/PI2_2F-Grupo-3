from flask import Flask
from flask_cors import CORS

from config import CORS_ORIGINS
from routes import register_routes


def create_app():
    app = Flask(__name__)
    CORS(app, origins=CORS_ORIGINS, supports_credentials=True)
    register_routes(app)
    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
