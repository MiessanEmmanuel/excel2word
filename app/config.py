import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY="votre_cle_secrete"
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False