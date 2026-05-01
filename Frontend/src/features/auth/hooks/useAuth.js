import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import { loginUser, registerUser, logoutUser, getUserDetails } from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;
    
    const handleLogin = async({email, password}) => {
        setLoading(true);
        try {
            const data = await loginUser(email, password);
            setUser(data);
        }
        catch (error) {
            console.error(`Error in handleLogin: ${error}`);
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async({email, password, username}) => {
        setLoading(true);
        try {
            const data = await registerUser(email, password, username);
            setUser(data);
        }
        catch (error) {
            console.error(`Error in handleRegister: ${error}`);
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async() => {
        setLoading(true);
        try {
            await logoutUser();
            setUser(null);
        }
        catch (error) {
            console.error(`Error in handleLogout: ${error}`);
        } finally {
            setLoading(false);            
        }
    }


    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getUserDetails();
                console.log("useAuth getAndSetUser: ", data);
                setUser(data);
            }
            catch (err) {
                console.error(`Error in getAndSetUser: ${err}`);
            } finally {
                setLoading(false);
            }
        }

        getAndSetUser();

    }, []);

    return {user, loading, handleLogin, handleRegister, handleLogout};
}