import jwt
import datetime
from flask import request, jsonify, current_app, Blueprint
from app import db, bcrypt
from app.models.user import Utilisateur
from datetime import datetime, timedelta 
from .. import db
from app.utils.token_required import token_required

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['mot_de_passe']).decode('utf-8')
    
    new_user = Utilisateur(
        nom = data['nom'],
        email = data['email'],
        mot_de_passe = hashed_password,
        role = data['role'],
        actif = data['actif'],
        cree_le = datetime.now()
    )
    
    
    db.session.add(new_user)
    db.session.commit()
    
    return ({"message" : "Utilisateur enregistré avec succès"}), 201
    



@bp.route('/login', methods=['POST'])
def login():
    data=request.get_json()
    user = Utilisateur.query.filter_by(email=data['email']).first()
    
    if user and bcrypt.check_password_hash(user.mot_de_passe, data['mot_de_passe']):
        token = jwt.encode({
            'user_id' : user.id,
            'exp' : datetime.utcnow() + timedelta(hours=1)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            "user_id" : user.id,
            "token" : token
            })
    return ({"message" : "Token Invalid"}), 401
        

@bp.route('/verify-token', methods=['GET'])
@token_required
def verify_token(current_user):
    """Vérifier la validité d'un token"""
    try:
        return jsonify({
            'message': 'Token valide.',
            'valid': True,
            'user': {
                'id': current_user.id,
                'nom': current_user.nom,
                'email': current_user.email,
                'role': current_user.role
            }
        }), 200
    except Exception as e:
        return jsonify({
            'message': 'Erreur lors de la vérification du token',
            'error': str(e)
        }), 500