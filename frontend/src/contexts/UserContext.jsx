// contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const UserContext = createContext()

const apiUrl = import.meta.env.VITE_API_URL
export function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)


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
                setCurrentUser(res.data)
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur :', error)
                setCurrentUser(null)
            } finally {
                setLoading(false)
            }
        }

        fetchCurrentUser()
    }, [])

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser doit être utilisé dans un UserProvider')
    }
    return context
}