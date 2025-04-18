import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";

// Skapa kontext
const AuthContext = createContext();

// Provider för att hantera och dela autentiseringsstatus
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Uppdatera användarens status för att få senaste informationen
                await user.reload(); // Uppdaterar användarobjektet från servern
                setUser({ ...user }); // Sprid ut det uppdaterade objektet för att säkerställa reaktivitet
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Anpassad hook för att använda Auth Context
export const useAuth = () => useContext(AuthContext);

