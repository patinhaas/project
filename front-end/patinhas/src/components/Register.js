import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importe o hook useNavigate
import './css/Register.css';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate(); // Use o hook useNavigate

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
            const response = await fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data.msg);
                localStorage.setItem('user', JSON.stringify(data.user)); // Salva o usuário no localStorage
                navigate('/homeuser'); // Redirecione para a tela de doações
            } else {
                console.error(data.msg);
            }
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Cadastro de Usuário</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Nome:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                <label htmlFor="password">Senha:</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                <label htmlFor="confirmPassword">Confirme a Senha:</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
}

export default Register;
