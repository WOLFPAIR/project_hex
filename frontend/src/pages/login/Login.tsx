import React, { useState } from 'react';
import { useLoginMutation } from '../../services/authApi';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, error }] = useLoginMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password }).unwrap();
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to login:', err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-menu">
                <div className="login_for_query">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
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
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                        {error && <p style={{ color: 'red' }}>Login failed</p>}
                        <p>Don't have an account? <a href="/register">Register</a></p>
                        <p style={{ marginTop: '10px' }}><a href="/">← Back to Landing</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
}
