import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

// Skapa kontext
const AuthContext = createContext();

// Provider för att hantera och dela autentiseringsstatus
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false); // Indikerar att autentiseringsstatus har laddats

            if (user) {
                console.log(user.email + " is logged in!");
            } else {
                console.log('User is logged out!');
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
        <AuthContext.Provider value={{ user, loading, handleSignOut}}>
            {children}
        </AuthContext.Provider>
    );
};

// Anpassad hook för att använda Auth Context
export const useAuth = () => useContext(AuthContext);


