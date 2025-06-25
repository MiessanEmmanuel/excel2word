import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

try:
    conn = engine.connect()

    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as ex:
    print("Erreur :", ex)