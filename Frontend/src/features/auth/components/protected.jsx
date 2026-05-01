import {useAuth} from '../hooks/useAuth.js';
import { Navigate } from 'react-router';


const Protected = ({children}) => {
    const { user, loading } = useAuth();
    console.log("Protected Component: ", { user, loading });
    if (loading) {
        return <main><h1>Loading...</h1></main>
    }

    if (!user) {
        console.log(`User not authenticated, redirecting to login... ${user}`);
        return <Navigate to="/login" />
    }

    return children;
}

export default Protected