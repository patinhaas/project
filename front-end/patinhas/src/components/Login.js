import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <div className="container-fluid" style={{ backgroundColor: '#1eadef', height: '100vh' }}>
            <div className="row justify-content-center align-items-center" style={{ height: '100%' }}>
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-lg" style={{ backgroundColor: '#ffffff' }}>
                        <div className="card-body p-5">
                            <h2 className="card-title text-center mb-4" style={{ color: '#1eadef' }}>Login</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Senha:</label>
                                    <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary btn-lg" style={{ backgroundColor: '#f1511b', borderColor: '#f1511b' }}>Entrar</button>
                                </div>
                            </form>
                            <p className="mt-3 text-center">Não tem uma conta? <a href="/cadastro">Cadastrar-se</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
