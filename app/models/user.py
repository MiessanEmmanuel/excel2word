from .. import db
from datetime import datetime

class Utilisateur(db.Model):
    __tablename__ = 'utilisateurs'

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, unique=True, nullable=False)
    mot_de_passe = db.Column(db.Text, nullable=False)  # à hasher avec bcrypt
    role = db.Column(db.String(50), default='consultant')
    actif = db.Column(db.Boolean, default=True)
    cree_le = db.Column(db.DateTime, default=datetime.utcnow)

