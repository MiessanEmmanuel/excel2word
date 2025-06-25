import jwt
from functools import wraps
from flask import request, jsonify, current_app
from app.models.user import Utilisateur

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Récupérer le token du header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token absent'}), 401
        
        try:
            # Décoder le token JWT
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            
            # Récupérer l'utilisateur depuis la base de données
            current_user = Utilisateur.query.get(data['user_id'])
            
            if not current_user:
                return jsonify({'message': 'Utilisateur non trouvé'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expiré'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token invalide'}), 401
        except Exception as e:
            return jsonify({'message': 'Erreur lors de la validation du token', 'error': str(e)}), 401
        
        # Passer current_user comme premier argument à la fonction décorée
        return f(current_user, *args, **kwargs)
    
    return decorated

def role_required(required_role):
    """
    Décorateur pour vérifier le rôle de l'utilisateur
    
    Args:
        required_role (str): Le rôle requis pour accéder à la route
    """
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated_function(current_user, *args, **kwargs):
            # Vérifier si l'utilisateur est actif
            if not current_user.actif:
                return jsonify({'message': 'Compte utilisateur désactivé'}), 403
            
            # Vérifier le rôle
            if current_user.role != required_role:
                return jsonify({
                    'message': f'Accès refusé. Rôle requis: {required_role}',
                    'votre_role': current_user.role
                }), 403
            
            return f(current_user, *args, **kwargs)
        
        return decorated_function
    return decorator

def admin_required(f):
    """
    Décorateur spécifique pour les administrateurs
    """
    return role_required('admin')(f)