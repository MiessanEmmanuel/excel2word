import axios from 'axios';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
    const logout = () => {
        // Nettoyer le localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Nettoyer les headers axios
        delete axios.defaults.headers.common['Authorization'];

        window.location.reload()

    };
    return (
        <>

            <nav className="bg-blue-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="font-bold text-xl">Athari</div>
                    <div className="flex items-center">

                        <Link to="/" className="hover:text-blue-200 transition duration-300 mr-4">
                            <i className="fas fa-home"></i> Accueil
                        </Link>
                        <Link to="/projets" className="hover:text-blue-200 transition duration-300 mr-4">
                            <i className="fa-solid fa-database"></i> Projets
                        </Link>

                        <a href="#" className="hover:text-blue-200 transition duration-300 mr-4">
                            <i className="fas fa-question-circle"></i> Aide
                        </a>

                        <button className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md hover:text-blue-200 transition duration-300 mr-4" onClick={() => logout()}>
                            Deconnexion
                        </button>
                    </div>
                </div>
            </nav>




            <main className="container mx-auto px-4 py-8 ">
                {children}


            </main>


            <footer className="bg-gray-800 text-white py-6 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2025 Athari - Gestion de porjet</p>
                </div>
            </footer>






        </>
    )
}

export default Layout