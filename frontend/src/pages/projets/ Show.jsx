import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, Calendar, Users, DollarSign, MapPin, Phone, Mail, FileText, Shield, Building, Locate, Map } from 'lucide-react';
import Layout from '../../layouts/Layout';


const ShowProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL

    const [currentUser, setCurrentUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true)


    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await axios.get(`${apiUrl}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                )
                setCurrentUser(res.data.user)

            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur :', error)
                setCurrentUser(null)
            } finally {
                setLoadingUser(false)
            }
        }

        fetchCurrentUser()
    }, [])

    // Charger les données du projet
    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;

            try {
                const response = await axios.get(`${apiUrl}/projets/${id}`);
                setProject(response.data);
            } catch (error) {
                setError('Erreur lors du chargement du projet.');
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Non définie';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'Non défini';
        return amount;
    };

    const handleEdit = () => {
        navigate(`/projets/edit/${id}`);
    };

    const handleBack = () => {
        navigate('/projets');
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-center items-center h-64">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Chargement du projet...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="text-center">
                                <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
                                <button
                                    onClick={handleBack}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Retour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!project) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="text-center">
                                <p className="text-gray-600">Projet non trouvé</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* En-tête */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.nom_projet}</h1>
                                    <p className="text-lg text-gray-600">{project.desc_courte}</p>
                                    <div className="flex items-center mt-2 space-x-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {project.domaine_expertise}
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {project.metier}
                                        </span>

                                        {project.projet_confidentiel && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <Shield className="w-3 h-3 mr-1" />
                                                Confidentiel
                                            </span>
                                        )}
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                                            <MapPin className="w-3 h-3 mr-1" /> {project.pays}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleBack}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                    >
                                        Retour
                                    </button>
                                    {loadingUser ? '...' :

                                        currentUser.role == "admin" &&
                                        (
                                            <button
                                                onClick={handleEdit}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                                            >
                                                Modifier
                                            </button>
                                        )
                                    }

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Colonne principale */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Description détaillée */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Description du projet
                                </h2>
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-gray-700 leading-relaxed">{project.desc_longue || 'Aucune description détaillée fournie.'}</p>
                                    {project.desc_anglaise && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                                            <h4 className="font-medium text-gray-900 mb-2">English Description</h4>
                                            <p className="text-gray-700 italic">{project.desc_anglaise}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Résultats et Impact */}
                            {project.resultat_impact && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                        Résultats et Impact
                                    </h2>
                                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                        <p className="text-green-800">{project.resultat_impact}</p>
                                    </div>
                                </div>
                            )}

                            {/* Équipe projet */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Users className="w-5 h-5 mr-2" />
                                    Équipe et Ressources
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.equipe_projet && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Équipe Projet</h4>
                                            <p className="text-gray-700">{project.equipe_projet}</p>
                                        </div>
                                    )}
                                    {project.contact_ressource && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Contact Ressource</h4>
                                            <p className="text-gray-700">{project.contact_ressource}</p>
                                        </div>
                                    )}
                                    {project.consultants_associes && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Consultants Associés</h4>
                                            <p className="text-gray-700">{project.consultants_associes}</p>
                                        </div>
                                    )}
                                    {project.cadres_societe && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Cadres Société</h4>
                                            <p className="text-gray-700">{project.cadres_societe}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                                    {project.nb_employes_mission && (
                                        <div className="text-center p-3 bg-blue-50 rounded-md">
                                            <div className="text-2xl font-bold text-blue-600">{project.nb_employes_mission}</div>
                                            <div className="text-sm text-blue-800">Employés Mission</div>
                                        </div>
                                    )}
                                    {project.nb_employes_consultants && (
                                        <div className="text-center p-3 bg-green-50 rounded-md">
                                            <div className="text-2xl font-bold text-green-600">{project.nb_employes_consultants}</div>
                                            <div className="text-sm text-green-800">Employés Consultants</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sous-domaines */}
                            {project.sous_domaines && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                        Sous-domaines
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {project.sous_domaines.split(',').map((domaine, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                                            >
                                                {domaine.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Informations client */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Building className="w-5 h-5 mr-2" />
                                    Client
                                </h2>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{project.nom_client}</h4>
                                        {project.client_confidentiel && (
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                                                <Shield className="w-3 h-3 mr-1" />
                                                Client Confidentiel
                                            </span>
                                        )}
                                    </div>
                                    {project.adresse_client && (
                                        <div className="flex items-start">
                                            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                                            <div>
                                                <p className="text-gray-700">{project.adresse_client}</p>
                                                {project.ville && <p className="text-gray-500 text-sm">{project.ville}</p>}
                                            </div>
                                        </div>
                                    )}
                                    {project.contacts_client && (
                                        <div className="flex items-center">
                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                            <p className="text-gray-700">{project.contacts_client}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Dates et durée */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Planification
                                </h2>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Date de début</h4>
                                        <p className="text-gray-700">{formatDate(project.date_debut)}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Date de fin</h4>
                                        <p className="text-gray-700">{formatDate(project.date_fin)}</p>
                                    </div>
                                    {project.date_debut && project.date_fin && (
                                        <div className="pt-2 border-t border-gray-200">
                                            <h4 className="font-medium text-gray-900">Durée</h4>
                                            <p className="text-gray-700">
                                                {Math.ceil((new Date(project.date_fin) - new Date(project.date_debut)) / (1000 * 60 * 60 * 24))} jours
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Coût */}
                            {project.cout_projet && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <DollarSign className="w-5 h-5 mr-2" />
                                        Budget
                                    </h2>
                                    <div className="text-center p-4 bg-yellow-50 rounded-md">
                                        <div className="text-2xl font-bold text-yellow-800">{formatCurrency(project.cout_projet)}</div>
                                        <div className="text-sm text-yellow-600">Coût total du projet</div>
                                    </div>
                                </div>
                            )}

                            {/* Statut et options */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Statut et Options
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700">Documents</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.contient_documents
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {project.contient_documents ? 'Oui' : 'Non'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700">Projet confidentiel</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.projet_confidentiel
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {project.projet_confidentiel ? 'Oui' : 'Non'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700">Client confidentiel</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.client_confidentiel
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {project.client_confidentiel ? 'Oui' : 'Non'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ShowProject;