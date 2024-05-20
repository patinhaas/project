import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Login.css'; 

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data.msg);
                navigate('/homeuser', { state: { user: data.user } });
                localStorage.setItem('user', JSON.stringify(data.user));

            } else {
                console.error(data.msg);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    <br />
                    <label htmlFor="password">Senha:</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                    <br />
                    <button type="submit">Entrar</button>
                </form>
                <p>Não tem uma conta? <a href="/cadastro">Cadastrar-se</a></p>
            </div>
        </div>
    );
}

export default Login;
