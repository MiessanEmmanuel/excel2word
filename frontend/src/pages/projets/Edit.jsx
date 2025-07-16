import React, { useState, useEffect } from 'react';
import Layout from '../../layouts/Layout';
import { useParams, useNavigate } from 'react-router-dom'

import axios from 'axios';

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const [currentUser, setCurrentUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true)
    const [formData, setFormData] = useState({
        nom_client: '',
        nom_projet: '',
        pays: '',
        ville: '',
        adresse_client: '',
        contacts_client: '',
        domaine_expertise: '',
        metier: '',
        desc_courte: '',
        desc_longue: '',
        resultat_impact: '',
        contact_ressource: '',
        equipe_projet: '',
        nb_employes_mission: '',
        consultants_associes: '',
        nb_employes_consultants: '',
        cadres_societe: '',
        date_debut: '',
        date_fin: '',
        contient_documents: false,
        cout_projet: '',
        projet_confidentiel: false,
        client_confidentiel: false,
        desc_anglaise: '',
        sous_domaines: ''
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [message, setMessage] = useState('');



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

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;

            try {
                const response = await axios.get(`${apiUrl}/projets/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Erreur:', error);
                setMessage('Erreur lors du chargement du projet.');
            } finally {
                setLoadingData(false);
            }
        };

        fetchProject();
    }, [id]);


    if (loadingUser) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-center items-center h-64">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                    <p className="text-gray-600">Chargement du projet...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }




    // Charger les données du projet


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await axios.put(`${apiUrl}/projets/${id}`, formData);
            setMessage('Projet modifié avec succès !');

            // Redirection après succès (facultatif)
            setTimeout(() => {
                navigate('/projets'); // ou autre page de ton choix
            }, 1500);
        } catch (error) {
            console.error('Erreur:', error);
            if (error.response?.data?.message) {
                setMessage(`Erreur : ${error.response.data.message}`);
            } else {
                setMessage('Erreur lors de la modification du projet.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/projets'); // Redirige vers la liste des projets ou une autre page
    };

    if (loadingData) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-center items-center h-64">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                    <p className="text-gray-600">Chargement du projet...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }


    if (currentUser.role != "admin") {
        navigate('/not-found');
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Modifier le projet</h1>
                            <span className="text-sm text-gray-500">ID: {id}</span>
                        </div>

                        {message && (
                            <div className={`mb-6 p-4 rounded-md ${message.includes('succès')
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                                }`}>
                                {message}
                            </div>
                        )}

                        <div onSubmit={handleSubmit} className="space-y-6">
                            {/* Informations du client */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Informations du client</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nom du client *
                                        </label>
                                        <input
                                            type="text"
                                            name="nom_client"
                                            value={formData.nom_client}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ville
                                        </label>
                                        <input
                                            type="text"
                                            name="ville"
                                            value={formData.ville}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Adresse du client
                                        </label>
                                        <input
                                            type="text"
                                            name="adresse_client"
                                            value={formData.adresse_client}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contacts du client
                                        </label>
                                        <input
                                            type="text"
                                            name="contacts_client"
                                            value={formData.contacts_client}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Informations du projet */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Informations du projet</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nom du projet *
                                        </label>
                                        <input
                                            type="text"
                                            name="nom_projet"
                                            value={formData.nom_projet}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Domaine d'expertise
                                        </label>
                                        <input
                                            type="text"
                                            name="domaine_expertise"
                                            value={formData.domaine_expertise}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Métier
                                        </label>
                                        <input
                                            type="text"
                                            name="metier"
                                            value={formData.metier}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Pays
                                        </label>
                                        <input
                                            type="text"
                                            name="pays"
                                            value={formData.pays}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sous-domaines
                                    </label>
                                    <input
                                        type="text"
                                        name="sous_domaines"
                                        value={formData.sous_domaines}
                                        onChange={handleChange}
                                        placeholder="Séparés par des virgules"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description courte
                                    </label>
                                    <input
                                        type="text"
                                        name="desc_courte"
                                        value={formData.desc_courte}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description longue
                                    </label>
                                    <textarea
                                        name="desc_longue"
                                        value={formData.desc_longue}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description anglaise
                                    </label>
                                    <textarea
                                        name="desc_anglaise"
                                        value={formData.desc_anglaise}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Résultat/Impact
                                    </label>
                                    <textarea
                                        name="resultat_impact"
                                        value={formData.resultat_impact}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Équipe et ressources */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Équipe et ressources</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact ressource
                                        </label>
                                        <input
                                            type="text"
                                            name="contact_ressource"
                                            value={formData.contact_ressource}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Équipe projet
                                        </label>
                                        <input
                                            type="text"
                                            name="equipe_projet"
                                            value={formData.equipe_projet}
                                            onChange={handleChange}
                                            placeholder="Noms séparés par des virgules"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre d'employés mission
                                        </label>
                                        <input
                                            type="number"
                                            name="nb_employes_mission"
                                            value={formData.nb_employes_mission}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Consultants associés
                                        </label>
                                        <input
                                            type="text"
                                            name="consultants_associes"
                                            value={formData.consultants_associes}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre d'employés consultants
                                        </label>
                                        <input
                                            type="number"
                                            name="nb_employes_consultants"
                                            value={formData.nb_employes_consultants}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cadres société
                                        </label>
                                        <input
                                            type="text"
                                            name="cadres_societe"
                                            value={formData.cadres_societe}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dates et coût */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Dates et coût</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date de début
                                        </label>
                                        <input
                                            type="date"
                                            name="date_debut"
                                            value={formData.date_debut}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date de fin
                                        </label>
                                        <input
                                            type="date"
                                            name="date_fin"
                                            value={formData.date_fin}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Coût du projet
                                        </label>
                                        <input
                                            type="text"
                                            name="cout_projet"
                                            value={formData.cout_projet}
                                            onChange={handleChange}
                                            placeholder="ex: 15 000 000 FCFA"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="pb-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Options</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="contient_documents"
                                            checked={formData.contient_documents}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-primary focus:ring-secondary border-gray-300 rounded"
                                        />
                                        <label className="ml-2 text-sm text-gray-700">
                                            Contient des documents
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="projet_confidentiel"
                                            checked={formData.projet_confidentiel}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-primary focus:ring-secondary border-gray-300 rounded"
                                        />
                                        <label className="ml-2 text-sm text-gray-700">
                                            Projet confidentiel
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="client_confidentiel"
                                            checked={formData.client_confidentiel}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-primary focus:ring-secondary border-gray-300 rounded"
                                        />
                                        <label className="ml-2 text-sm text-gray-700">
                                            Client confidentiel
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Boutons */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Modification...' : 'Modifier le projet'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EditProject;




