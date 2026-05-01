import React from 'react'
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';

const Register = () => {
    const { handleRegister, loading } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");


    const handleSubmit = async(e) => {
        e.preventDefault();
        // Handle registration logic here
        await handleRegister({ username, email, password });
        navigate("/");
    }

    if(loading) {
        return <p>Loading...</p>
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text" name="username" id="username" placeholder='Enter your name' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" name="email" id="email" placeholder='Enter your email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" name="password" id="password" placeholder='Enter your password' />
                    </div>
                    <button className='button primary-button'>Register</button>
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </main>
  )
}

export default Register