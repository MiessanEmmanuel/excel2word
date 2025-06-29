from flask import Blueprint, render_template, request, jsonify
from ..models.user import Utilisateur
from datetime import datetime
import os
from app.utils.role_required import admin_required

from app import db, bcrypt  # Importez votre instance de base de données

bp = Blueprint('utilisateurs', __name__, url_prefix='/users')

# Route pour récupérer tous les utilisateurs
@bp.route('/', methods=['GET'])
@admin_required
def get_all_users(current_user):
    try:
        users = Utilisateur.query.all()
        users_data = []
        for user in users:
            users_data.append({
                'id': user.id,
                'nom': user.nom,
                'email': user.email,
                'role': user.role,
                'actif': user.actif,
                'cree_le': user.cree_le.isoformat() if user.cree_le else None
            })
        return jsonify(users_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route pour récupérer un utilisateur par ID
@bp.route('/<int:user_id>', methods=['GET'])
@admin_required
def get_one_user(current_user, user_id: int):
    try:
        user = Utilisateur.query.filter(Utilisateur.id == user_id).first()
        if not user:
            return jsonify({'error': 'Utilisateur non trouvé'}), 404
        
        user_data = {
            'id': user.id,
            'nom': user.nom,
            'email': user.email,
            'role': user.role,
            'actif': user.actif,
            'cree_le': user.cree_le.isoformat() if user.cree_le else None
        }
        return jsonify(user_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route pour créer un nouvel utilisateur
@bp.route('/', methods=['POST'])
@admin_required
def create_user(current_user):
    try:
        data = request.get_json()
        
        # Validation des données requises
        if not data or not all(key in data for key in ['nom', 'email', 'mot_de_passe']):
            return jsonify({'error': 'Données manquantes: nom, email et mot_de_passe sont requis'}), 400
        
        # Vérifier si l'email existe déjà
        existing_user = Utilisateur.query.filter(Utilisateur.email == data['email']).first()
        if existing_user:
            return jsonify({'error': 'Un utilisateur avec cet email existe déjà'}), 409
        
        utilisateur = Utilisateur(
            nom=data['nom'],
            email=data['email'],
            mot_de_passe= bcrypt.generate_password_hash(data['mot_de_passe']).decode('utf-8'),
            role=data.get('role', 'consultant'),
            actif=data.get('actif', True)
        )
        
        db.session.add(utilisateur)
        db.session.commit()
        
        user_data = {
            'id': utilisateur.id,
            'nom': utilisateur.nom,
            'email': utilisateur.email,
            'role': utilisateur.role,
            'actif': utilisateur.actif,
            'cree_le': utilisateur.cree_le.isoformat() if utilisateur.cree_le else None
        }
        
        return jsonify(user_data), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Route pour mettre à jour un utilisateur
@bp.route('/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(current_user, user_id: int):
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Aucune donnée fournie'}), 400
        
        utilisateur = Utilisateur.query.filter(Utilisateur.id == user_id).first()
        if not utilisateur:
            return jsonify({'error': 'Utilisateur non trouvé'}), 404
        
        # Mise à jour des champs si fournis
        if 'nom' in data:
            utilisateur.nom = data['nom']
        if 'email' in data:
            # Vérifier si le nouvel email n'est pas déjà utilisé par un autre utilisateur
            existing_user = Utilisateur.query.filter(
                Utilisateur.email == data['email'], 
                Utilisateur.id != user_id
            ).first()
            if existing_user:
                return jsonify({'error': 'Un autre utilisateur utilise déjà cet email'}), 409
            utilisateur.email = data['email']
        if 'mot_de_passe' in data:
            utilisateur.mot_de_passe = bcrypt.generate_password_hash(data['mot_de_passe']).decode('utf-8')
        if 'role' in data:
            utilisateur.role = data['role']
        if 'actif' in data:
            utilisateur.actif = data['actif']
        
        db.session.commit()
        
        user_data = {
            'id': utilisateur.id,
            'nom': utilisateur.nom,
            'email': utilisateur.email,
            'role': utilisateur.role,
            'actif': utilisateur.actif,
            'cree_le': utilisateur.cree_le.isoformat() if utilisateur.cree_le else None
        }
        
        return jsonify(user_data), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Route pour supprimer un utilisateur
@bp.route('/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(current_user, user_id: int):
    try:
        utilisateur = Utilisateur.query.filter(Utilisateur.id == user_id).first()
        if not utilisateur:
            return jsonify({'error': 'Utilisateur non trouvé'}), 404
        
        db.session.delete(utilisateur)
        db.session.commit()
        
        return jsonify({'message': 'Utilisateur supprimé avec succès'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500