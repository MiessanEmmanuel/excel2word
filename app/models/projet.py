from .. import db
from datetime import datetime

class Projet(db.Model):
    __tablename__ = 'projets'

    id = db.Column(db.Integer, primary_key=True)
    nom_client = db.Column(db.Text)
    nom_projet = db.Column(db.Text)
    pays = db.Column(db.Text)
    ville = db.Column(db.Text)
    adresse_client = db.Column(db.Text)
    contacts_client = db.Column(db.Text)
    domaine_expertise = db.Column(db.Text)
    metier = db.Column(db.Text)
    desc_courte = db.Column(db.Text)
    desc_longue = db.Column(db.Text)
    resultat_impact = db.Column(db.Text)
    contact_ressource = db.Column(db.Text)
    equipe_projet = db.Column(db.Text)
    nb_employes_mission = db.Column(db.Integer)
    consultants_associes = db.Column(db.Text)
    nb_employes_consultants = db.Column(db.Integer)
    cadres_societe = db.Column(db.Text)
    date_debut = db.Column(db.Date)
    date_fin = db.Column(db.Date)
    contient_documents = db.Column(db.Boolean)
    cout_projet = db.Column(db.Text)
    projet_confidentiel = db.Column(db.Boolean)
    client_confidentiel = db.Column(db.Boolean)
    desc_anglaise = db.Column(db.Text)
    sous_domaines = db.Column(db.Text)


    def to_dict(self):
        return {
            'id': self.id,
            'nom_client': self.nom_client,
            'nom_projet': self.nom_projet,
            'pays': self.pays,
            'ville': self.ville,
            'adresse_client': self.adresse_client,
            'contacts_client': self.contacts_client,
            'domaine_expertise': self.domaine_expertise,
            'metier': self.metier,
            'desc_courte': self.desc_courte,
            'desc_longue': self.desc_longue,
            'resultat_impact': self.resultat_impact,
            'contact_ressource': self.contact_ressource,
            'equipe_projet': self.equipe_projet,
            'nb_employes_mission': self.nb_employes_mission,
            'consultants_associes': self.consultants_associes,
            'nb_employes_consultants': self.nb_employes_consultants,
            'cadres_societe': self.cadres_societe,
            'date_debut': self.date_debut.isoformat() if self.date_debut else None,
            'date_fin': self.date_fin.isoformat() if self.date_fin else None,
            'contient_documents': self.contient_documents,
            'cout_projet': self.cout_projet,
            'projet_confidentiel': self.projet_confidentiel,
            'client_confidentiel': self.client_confidentiel,
            'desc_anglaise': self.desc_anglaise,
            'sous_domaines': self.sous_domaines,

        }


