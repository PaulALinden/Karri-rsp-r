import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut, sendEmailVerification } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

// Skapa kontext
const AuthContext = createContext();

// Provider för att hantera och dela autentiseringsstatus
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {

            if (user && !user.emailVerified) {
                //sendEmailVerification(user);
                setLoading(false);
                //const error = new Error('Please verify your email');
                //error.code = "auth/email-verification";
                //throw error;
            } else {
                setUser(user);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, handleSignOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// Anpassad hook för att använda Auth Context
export const useAuth = () => useContext(AuthContext);


