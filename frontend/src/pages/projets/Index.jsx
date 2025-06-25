import React, { useState, useEffect, useMemo } from 'react';
import axios from "axios";
import Layout from '../../layouts/Layout';
import { Link } from 'react-router-dom';
import { Delete, Download, Edit, Eye, Loader, Plus } from 'lucide-react';



const Projects = () => {

    const apiUrl = import.meta.env.VITE_API_URL

    // State variables
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('nom');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [notifications, setNotifications] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');

                const res = await axios.get(`${apiUrl}/projets`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setProjects(res.data) // stocke les projets

            } catch (error) {
                console.error('Erreur lors de la récupération des projets :', error)
            }
        }

        fetchProjects()
    }, [])


    // Filtered and sorted projects
    const filteredProjects = useMemo(() => {
        const filtered = projects.filter(project => {
            const searchLower = searchTerm.toLowerCase();

            const fieldsToSearch = [
                project.nom_projet || '',
                project.nom_client || '',
                project.ville || '',
                project.contacts_client || ''
            ];

            return fieldsToSearch.some(field =>
                field.toLowerCase().includes(searchLower)
            );
        });

        // Sort projects
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'nom':
                    return a.nom_projet.localeCompare(b.nom);
                case 'client':
                    return a.nom_client.localeCompare(b.nom_client);
                case 'ville':
                    return a.ville.localeCompare(b.ville);
                case 'date':
                    return new Date(b.date_debut) - new Date(a.date_debut);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [projects, searchTerm, sortBy]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    // Reset to first page when search or sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortBy, itemsPerPage]);

    // Adjust current page if it exceeds total pages
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    // Statistics
    const stats = useMemo(() => {
        const activeProjects = filteredProjects.filter(p => p.statut === 'Actif').length;
        const uniqueClients = new Set(filteredProjects.map(p => p.nom_client));

        return {
            total: filteredProjects.length,
            active: activeProjects,
            clients: uniqueClients.size
        };
    }, [filteredProjects]);

    // Utility functions
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Actif':
                return 'bg-green-100 text-green-800';
            case 'En cours':
                return 'bg-yellow-100 text-yellow-800';
            case 'Terminé':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Show notification
    const showNotification = (message, type = 'info') => {
        const id = Date.now();
        const notification = { id, message, type };
        setNotifications(prev => [...prev, notification]);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    // Download functions
    const downloadProject = async (projectId, format, event) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = '...'
            button.disabled = true;
            try {
                const response = await axios.get(`${apiUrl}/download-word-${format.toLowerCase()}/${project.id}`, {
                    responseType: 'blob',
                });

                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                });

                setTimeout(() => {

                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `projet_${project.nom_projet}_format_${format}.docx`;
                    setTimeout(() => {

                        button.textContent = originalText;
                        button.disabled = false;
                    }, 1000);
                    a.click();
                    window.URL.revokeObjectURL(url);

                    showNotification(`Téléchargement du projet "${project.nom_projet}" au format ${format}`, 'success');
                }, 1500);

            } catch (error) {
                console.error('Erreur lors du téléchargement du fichier Word:', error);
                showNotification(`Erreur lors du téléchargement du projet "${project.nom_projet}" au format ${format}`, 'error');

            }

        }
    };

    const downloadAllProjectsGIZ = async (event) => {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '...'
        button.disabled = true;
        try {
            const response = await axios.get(`${apiUrl}/download-word-giz`, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });

            setTimeout(() => {

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `liste_projets_format_GIZ.docx`;
                setTimeout(() => {

                    button.textContent = originalText;
                    button.disabled = false;
                }, 1000);
                a.click();
                window.URL.revokeObjectURL(url);

                showNotification(`Téléchargement des projets au format GIZ`, 'success');
            }, 1500);

        } catch (error) {
            console.error('Erreur lors du téléchargement du fichier Word:', error);
            showNotification(`Erreur lors du téléchargement des projets au format GIZ`, 'error');

        }


    };


    const downloadWordFile = async () => {

    };


    const downloadAllWord = async (event) => {
        const button = event.target;
        const originalHtml = button.innerHTML;
        button.innerHTML = '<span>⏳</span> Téléchargement...';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = '<span>✅</span> Téléchargé !';
            setTimeout(() => {
                button.innerHTML = originalHtml;
                button.disabled = false;
            }, 2000);
        }, 2000);

        showNotification(`Téléchargement de ${filteredProjects.length} projets au format Word`, 'success');
    };

    const downloadAllExcel = async (event) => {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '...'
        button.disabled = true;
        try {
            const response = await axios.get(`${apiUrl}/download-excel`, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            setTimeout(() => {

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Base_de_donnee_athari.xlsx`;
                setTimeout(() => {

                    button.textContent = originalText;
                    button.disabled = false;
                }, 1000);
                a.click();
                window.URL.revokeObjectURL(url);

                showNotification(`Téléchargement des projets au format Excel`, 'success');
            }, 1500);

        } catch (error) {
            console.error('Erreur lors du téléchargement du fichier Excel:', error);
            showNotification(`Erreur lors du téléchargement des projets au format Excel`, 'error');

        }


    };

    // Delete functions
    const handleDeleteProject = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        setProjectToDelete(project);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (projectToDelete) {

            try {
                const res = await axios.delete(`${apiUrl}/projets/${projectToDelete.id}`)
                setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));

                showNotification(`Projet "${projectToDelete.nom_projet}" supprimé avec succès`, 'success');
                setShowDeleteModal(false);
                setProjectToDelete(null);
            } catch (error) {
                showNotification(`Erreur dans la suppression du projet "${projectToDelete.nom_projet}"`, 'error');
            }


        }
    };

    // Pagination functions
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const changePage = (direction) => {
        if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        } else if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    // Generate page numbers for pagination
    const generatePageNumbers = () => {
        if (totalPages <= 1) return [];

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        const pages = [];

        // First page and ellipsis
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Last page and ellipsis
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <Layout>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Projets</h1>
                    <p className="text-xl text-gray-600">Visualisez, gérez et téléchargez vos projets facilement</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl font-bold text-indigo-500 mb-2">{stats.total}</div>
                        <div className="text-gray-600">Total Projets</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl font-bold text-indigo-500 mb-2">{stats.active}</div>
                        <div className="text-gray-600">Projets Actifs</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl font-bold text-indigo-500 mb-2">{stats.clients}</div>
                        <div className="text-gray-600">Clients</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
                            <input
                                type="text"
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                                placeholder="Rechercher un projet, client, ville..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none bg-white cursor-pointer"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="nom">Trier par Nom</option>
                                <option value="client">Trier par Client</option>
                                <option value="ville">Trier par Ville</option>
                                <option value="date">Trier par Date</option>
                            </select>
                        </div>
                        <div className="flex lg:flex-row flex-col gap-2">
                            <button
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
                                onClick={(e) => downloadAllProjectsGIZ(e)}
                            >
                                <span><Download /></span> Télécharger Word (GIZ)
                            </button>
                            <button
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
                                onClick={downloadAllExcel}
                            >
                                <span> <Download /></span> Télécharger Excel
                            </button>
                            <Link
                                className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
                                to="/projets/create"
                            >
                                <span> <Plus /></span> Créer un nouveau projet
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Projects Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Table Header with Item Count and Per Page Selection */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Affichage de <span>{Math.min(startIndex + 1, filteredProjects.length)}</span> à <span>{Math.min(endIndex, filteredProjects.length)}</span> sur <span>{filteredProjects.length}</span> projets
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Afficher:</label>
                            <select
                                className="border border-gray-300 rounded px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                            <span className="text-sm text-gray-600">par page</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Nom du Projet</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Client</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Ville</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Adresse</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Date de Début</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Download</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedProjects.map(project => (
                                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{project.nom_projet}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{project.nom_client}</td>
                                        <td className="px-6 py-4 text-gray-700">{project.ville}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-600 text-sm">{project.adresse_client}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{formatDate(project.date_debut)} </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1">
                                                <button
                                                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors border border-indigo-500"
                                                    onClick={(e) => downloadProject(project.id, 'BM', e)}
                                                    title="Télécharger format Banque Mondiale"
                                                >
                                                    BM
                                                </button>
                                                <button
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors border border-green-500"
                                                    onClick={(e) => downloadProject(project.id, 'GIZ', e)}
                                                    title="Télécharger format GIZ"
                                                >
                                                    GIZ
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1">
                                                <Link
                                                    to={`/projets/${project.id}`}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs transition-colors"


                                                >
                                                    <Eye className='size-4' />
                                                </Link>
                                                <Link
                                                    to={`/projets/edit/${project.id}`}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs transition-colors"

                                                >
                                                    <Edit className='size-4' />

                                                </Link>
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs transition-colors"
                                                    onClick={() => handleDeleteProject(project.id)}
                                                    title="Supprimer le projet"
                                                >
                                                    <Delete className='size-4' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Page <span>{currentPage}</span> sur <span>{totalPages || 1}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                <button
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    onClick={() => changePage('prev')}
                                    disabled={currentPage <= 1}
                                >
                                    ← Précédent
                                </button>

                                {/* Page Numbers */}
                                <div className="flex gap-1">
                                    {generatePageNumbers().map((page, index) => (
                                        <React.Fragment key={index}>
                                            {page === '...' ? (
                                                <span className="px-3 py-2 text-sm text-gray-500">...</span>
                                            ) : (
                                                <button
                                                    className={`px-3 py-2 text-sm border rounded transition-colors ${page === currentPage
                                                        ? 'bg-indigo-500 text-white border-indigo-500'
                                                        : 'border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => goToPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>

                                {/* Next Button */}
                                <button
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    onClick={() => changePage('next')}
                                    disabled={currentPage >= totalPages}
                                >
                                    Suivant →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-xl max-w-md w-11/12 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirmer la suppression</h3>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Êtes-vous sûr de vouloir supprimer le projet "{projectToDelete?.nom_projet}" ? Cette action est irréversible.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                                onClick={confirmDelete}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${notification.type === 'success' ? 'bg-green-500 text-white' :
                            notification.type === 'error' ? 'bg-red-500 text-white' :
                                'bg-blue-500 text-white'
                            }`}
                    >
                        {notification.message}
                    </div>
                ))}
            </div>

        </Layout>

    );
};

export default Projects;