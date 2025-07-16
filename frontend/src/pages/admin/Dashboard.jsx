import { useAuth } from '../auth/AuthContext';
import React, { useState, useEffect } from 'react';

import {
    Users,
    UserPlus,
    Edit,
    Trash2,
    LogOut,
    BarChart3,
    FolderOpen,
    Shield,
    User,
    Search,
    X,
    Save,
    Eye,
    EyeOff,
    Home,
    Briefcase,
    HelpCircle,
    CheckCircle,
    AlertCircle,
    AlertTriangle
} from 'lucide-react';
import Layout from '../../layouts/Layout';

// Composant Alert personnalisé
const CustomAlert = ({ type, title, message, onClose, onConfirm, showConfirm = false }) => {
    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle className="w-6 h-6 text-green-600" />;
            case 'error': return <AlertCircle className="w-6 h-6 text-red-600" />;
            case 'warning': return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
            default: return <AlertCircle className="w-6 h-6 text-primary" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-200';
            case 'error': return 'bg-red-50 border-red-200';
            case 'warning': return 'bg-yellow-50 border-yellow-200';
            default: return 'bg-secondary-back border-blue-200';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`bg-white rounded-lg p-6 w-full max-w-md mx-4 border-2 ${getBgColor()}`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{message}</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    {showConfirm && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                    )}
                    <button
                        onClick={showConfirm ? onConfirm : onClose}
                        className={`px-4 py-2 rounded-lg text-white transition-colors ${type === 'error' || showConfirm
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-primary hover:bg-primary-hover'
                            }`}
                    >
                        {showConfirm ? 'Confirmer' : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalAdmins: 0,
        totalConsultants: 0
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [alert, setAlert] = useState(null);
    const [userForm, setUserForm] = useState({
        nom: '',
        email: '',
        mot_de_passe: '',
        role: 'consultant'
    });

    const apiUrl = import.meta.env.VITE_API_URL

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const showAlert = (type, title, message, onConfirm = null) => {
        setAlert({
            type,
            title,
            message,
            onConfirm,
            showConfirm: !!onConfirm
        });
    };

    const closeAlert = () => {
        setAlert(null);
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchStats(),
                fetchUsers()
            ]);
        } catch (err) {
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${apiUrl}/projets/stats`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Erreur API');
            const data = await response.json();
            //con
            setStats(data);
        } catch (err) {
            console.error('Erreur lors du chargement des statistiques:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${apiUrl}/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Erreur API');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error('Erreur lors du chargement des utilisateurs:', err);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userForm)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la création');
            }

            await fetchUsers();
            closeModal();
            showAlert('success', 'Succès', 'Utilisateur créé avec succès !');
        } catch (err) {
            showAlert('error', 'Erreur', err.message);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const updateData = { ...userForm };
            if (!updateData.mot_de_passe) {
                delete updateData.mot_de_passe;
            }

            const response = await fetch(`${apiUrl}/users/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la modification');
            }

            await fetchUsers();
            closeModal();
            showAlert('success', 'Succès', 'Utilisateur modifié avec succès !');
        } catch (err) {
            showAlert('error', 'Erreur', err.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        showAlert(
            'warning',
            'Confirmation de suppression',
            'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.',
            async () => {
                try {
                    const response = await fetch(`${apiUrl}/users/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Erreur lors de la suppression');
                    }

                    await fetchUsers();
                    closeAlert();
                    showAlert('success', 'Succès', 'Utilisateur supprimé avec succès !');
                } catch (err) {
                    closeAlert();
                    showAlert('error', 'Erreur', err.message);
                }
            }
        );
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setUserForm({
            nom: '',
            email: '',
            mot_de_passe: '',
            role: 'consultant'
        });
        setShowUserModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setUserForm({
            nom: user.nom,
            email: user.email,
            mot_de_passe: '',
            role: user.role
        });
        setShowUserModal(true);
    };

    const closeModal = () => {
        setShowUserModal(false);
        setEditingUser(null);
        setShowPassword(false);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setUserForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredUsers = users.filter(user =>
        user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement du dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <Layout className="">



            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Titre principal */}


                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Section Statistiques */}

                {/* Statistiques */}
                <div className='mb-5'>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Gestion des utilisateurs</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <h3 className="text-xl font-bold text-gray-700 mt-3">Profils utilisateurs</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center mb-3">
                                    <Shield className="w-5 h-5 text-red-600 mr-2" />
                                    <span className="text-sm font-medium text-gray-700">Administrateurs</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">{users.filter(user => user.role == "admin").length}</div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center mb-3">
                                    <User className="w-5 h-5 text-green-600 mr-2" />
                                    <span className="text-sm font-medium text-gray-700">Consultants</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">{users.filter(user => user.role != "admin").length}</div>
                            </div>
                        </div>
                    </div>
                </div>




                {/* Gestion des utilisateurs */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-700">Liste des utilisateurs</h3>
                            <button
                                onClick={openCreateModal}
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors flex items-center space-x-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Ajouter un utilisateur</span>
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Barre de recherche */}
                        <div className="mb-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un utilisateur..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Table des utilisateurs */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Utilisateur</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Rôle</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.map((userItem) => (
                                        <tr key={userItem.id} className="hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                        <User className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <span className="font-medium text-gray-900">{userItem.nom}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-gray-600">{userItem.email}</td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${userItem.role === 'admin'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {userItem.role === 'admin' ? 'Administrateur' : 'Consultant'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(userItem)}
                                                        className="text-primary hover:text-blue-800 p-1"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(userItem.id)}
                                                        className="text-red-600 hover:text-red-800 p-1"
                                                        disabled={userItem.id === user?.id}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <Users className="w-12 h-12 mx-auto" />
                                </div>
                                <p className="text-gray-500">Aucun utilisateur trouvé</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal Utilisateur */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={userForm.nom}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userForm.email}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mot de passe {editingUser && '(laisser vide pour ne pas changer)'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="mot_de_passe"
                                        value={userForm.mot_de_passe}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                                <select
                                    name="role"
                                    value={userForm.role}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                                >
                                    <option value="consultant">Consultant</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 pt-6">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={editingUser ? handleUpdateUser : handleCreateUser}
                                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors flex items-center space-x-2"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{editingUser ? 'Modifier' : 'Importer et continuer'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert personnalisé */}
            {alert && (
                <CustomAlert
                    type={alert.type}
                    title={alert.title}
                    message={alert.message}
                    onClose={closeAlert}
                    onConfirm={alert.onConfirm}
                    showConfirm={alert.showConfirm}
                />
            )}
        </Layout>
    );
};

export default AdminDashboard;