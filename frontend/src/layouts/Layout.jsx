import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../pages/auth/AuthContext';
import { useEffect, useState } from 'react';


const Layout = ({ children }) => {
    const { logout, isAuthenticated, user } = useAuth()

    const location = useLocation();

    const [currentUser, setCurrentUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true)
    const [showDropdown, setShowDropdown] = useState(false)

    const apiUrl = import.meta.env.VITE_API_URL;


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
    console.log(currentUser, loadingUser)

    /* const logout = () => {
        // Nettoyer le localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Nettoyer les headers axios
        delete axios.defaults.headers.common['Authorization'];

        window.location.reload()

    }; */

    return (
        <>

            <nav className="bg-primary text-white shadow-lg">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="font-bold text-xl">Athari Quals</div>
                    <div className="flex items-center">

                        <Link to="/" className={`hover:text-tertiary transition duration-300 mr-4 ${location.pathname == "/" ? "text-tertiary" : ""}`}>
                            <i className="fas fa-home"></i> Accueil
                        </Link>
                        <Link to="/projets" className={`hover:text-tertiary transition duration-300 mr-4 ${location.pathname == "/projets" ? "text-tertiary" : ""}`}>
                            <i className="fa-solid fa-database"></i> Projets
                        </Link>
                        {loadingUser ? <Loader2 className='size-5 animate-spin ' /> :
                            (
                                currentUser.role == "admin" ?
                                    (
                                        <div className='relative'>
                                            <button onClick={() => setShowDropdown(!showDropdown)} className={`bg-white hover:bg-gray-200 px-4 py-1 rounded-md text-black hover:text-black transition duration-300 mr-4 group`}>
                                                Admin
                                                {showDropdown && (
                                                    <>
                                                        <div class=" absolute -bottom-0  left-[50%] -translate-x-[50%] translate-y-[50%]  flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9 fill-white text-white group-hover:fill-gray-200 group-hover:text-gray-100 transition duration-300" viewBox="0 0 24 24"><path d="M12 16l-6-6h12l-6 6z"></path></svg></div>
                                                        <div className='bg-white/70 rounded-md text-gray-700 py-2 flex flex-col divide-y absolute left-[50%] -translate-x-[50%]  translate-y-[10px] border backdrop-blur-lg'>
                                                            <Link to="/admin" className="hover:bg-tertiary/30 px-3 py-1 text-sm transition duration-300">
                                                                Gestion des utilisateurs
                                                            </Link>
                                                            <button className='hover:bg-red-100 whitespace-nowrap text-red-500 px-3 py-1 text-sm transition duration-300' onClick={logout}>Se Déconnecter</button>
                                                        </div>
                                                    </>

                                                )}
                                            </button>

                                        </div>
                                    ) :
                                    (
                                        <button className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md hover:text-blue-200 transition duration-300 mr-4" onClick={logout}>
                                            Deconnexion
                                        </button>
                                    )

                            )}
                        {/* <button className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md hover:text-blue-200 transition duration-300 mr-4" onClick={() => logout()}>
                            Deconnexion
                        </button> */}
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