from .. import db


class Pays(db.Model):
    __tablename__ = 'pays'

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), unique=True, nullable=False)

