from flask import Flask, request, render_template, redirect, url_for, make_response
from flask_sqlalchemy import SQLAlchemy
from .config import Config
# Ne PAS importer CORS
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)

    # Gérer CORS manuellement
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = make_response()
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            return response

    @app.after_request
    def after_request(response):
        # Ajouter les headers CORS seulement s'ils n'existent pas déjà
        if "Access-Control-Allow-Origin" not in response.headers:
            response.headers["Access-Control-Allow-Origin"] = "*"
        return response

    # Importer les routes 
    from .controllers import user_controller, pays_controller, projet_controller, auth_controller
    app.register_blueprint(user_controller.bp)
    app.register_blueprint(auth_controller.bp)
    app.register_blueprint(pays_controller.bp)
    app.register_blueprint(projet_controller.bp)

    return app