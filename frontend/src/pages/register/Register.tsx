import React, { useState } from 'react';
import { useRegisterMutation } from '../../services/authApi';
import { useNavigate } from 'react-router-dom';
import '../login/Login.css'; // Reusing login styles

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [register, { isLoading, error }] = useRegisterMutation();
    const navigate = useNavigate();
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({ username, email, password }).unwrap();
            alert('Registration successful! Please login.');
            navigate('/');
        } catch (err) {
            console.error('Failed to register:', err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-menu">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        className="login-query"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="login-query"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password"  
                        className="login-query"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                    {error && <p style={{ color: 'red' }}>Error: {'data' in error ? JSON.stringify(error.data) : 'Something went wrong'}</p>}
                    <p>Already have an account? <a href="/">Login</a></p>
                </form>
            </div>
        </div>
    );
}
