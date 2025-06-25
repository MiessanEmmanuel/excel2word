
import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Eye, Edit, FileText, Download } from 'lucide-react';
import Layout from '../layouts/Layout';
import axios from 'axios';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL
const Home = () => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileSelect = (file) => {
        // Vérifier si le fichier est un fichier Excel
        const validExtensions = ['.xlsx', '.xls', '.xlsm'];
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];

        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

        if (!validExtensions.includes(fileExtension) && !validTypes.includes(file.type)) {
            alert('Veuillez sélectionner un fichier Excel valide (.xlsx ou .xls)');
            return;
        }

        setSelectedFile(file);
    };

    const handleFileInputChange = (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedFile) {
            try {
                const formData = new FormData()
                formData.append('excel_file', selectedFile)
                const res = await axios.post(`${API_URL}/upload-file`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(res.data)
                navigate('/projets')

            } catch (error) {
                console.error('Erreur lors de l\'upload :', error);
            }
        }
    };

    return (
        <Layout>
            <div className="  py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            Convertisseur Excel vers Documents Word
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Importez votre fichier Excel, visualisez et modifiez les données, puis générez des documents Word
                            individuels pour chaque ligne.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Upload section */}
                        <div className="bg-white rounded-lg shadow-md p-6 flex-1">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Importer un fichier Excel</h2>

                            <div className="mb-6">
                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 cursor-pointer ${isDragOver
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 bg-gray-50 hover:border-blue-500'
                                        }`}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={handleBrowseClick}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".xlsx,.xls,.xlsm"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                    />
                                    <div className="mb-4">
                                        <FileSpreadsheet className="w-20 h-20 text-gray-400 mx-auto" />
                                    </div>
                                    <p className="text-gray-600 mb-2">Glissez votre fichier Excel ici</p>
                                    <p className="text-gray-500 text-sm mb-4">ou</p>
                                    <button
                                        type="button"
                                        onClick={handleBrowseClick}
                                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
                                    >
                                        Parcourir les fichiers
                                    </button>
                                    <p className="text-gray-500 text-xs mt-3">Formats acceptés: .xlsx, .xls</p>
                                </div>

                                {selectedFile && (
                                    <div className="mt-4 text-center font-medium text-gray-700">
                                        {selectedFile.name}
                                    </div>
                                )}

                                <div className="mt-6 text-center">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!selectedFile}
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Importer et continuer
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Features section */}
                        <div className="bg-white rounded-lg shadow-md p-6 flex-1">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Fonctionnalités</h2>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                                        <Eye className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Visualisation des données</h3>
                                        <p className="text-gray-600 text-sm">
                                            Affichez les données de votre fichier Excel sous forme de tableau interactif
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                                        <Edit className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Modification des entrées</h3>
                                        <p className="text-gray-600 text-sm">
                                            Modifiez chaque ligne selon vos besoins avant de générer les documents
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Génération de documents Word</h3>
                                        <p className="text-gray-600 text-sm">
                                            Créez un document Word pour chaque ligne du tableau
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                                        <Download className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Téléchargement flexible</h3>
                                        <p className="text-gray-600 text-sm">
                                            Téléchargez des documents individuels ou tous les documents en une archive ZIP
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How it works section */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                            Comment ça fonctionne
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-lg shadow text-center">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="font-bold">1</span>
                                </div>
                                <h3 className="font-medium text-gray-800 mb-2">Importez</h3>
                                <p className="text-gray-600 text-sm">Téléversez votre fichier Excel</p>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow text-center">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="font-bold">2</span>
                                </div>
                                <h3 className="font-medium text-gray-800 mb-2">Visualisez</h3>
                                <p className="text-gray-600 text-sm">Consultez les données dans un tableau</p>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow text-center">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="font-bold">3</span>
                                </div>
                                <h3 className="font-medium text-gray-800 mb-2">Modifiez</h3>
                                <p className="text-gray-600 text-sm">Ajustez les données si nécessaire</p>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow text-center">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="font-bold">4</span>
                                </div>
                                <h3 className="font-medium text-gray-800 mb-2">Générez</h3>
                                <p className="text-gray-600 text-sm">Téléchargez vos documents Word</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;