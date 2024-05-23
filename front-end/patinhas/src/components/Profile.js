import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser ? storedUser.id : null;

    useEffect(() => {
        if (!userId) {
            setError('Usuário não autenticado');
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:3001/user/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                } else {
                    setError(data.msg || 'Erro ao buscar dados do usuário.');
                }
            } catch (error) {
                setError('Erro ao buscar dados do usuário.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:3001/update/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
                alert('Dados atualizados com sucesso');
            } else {
                setError(data.msg || 'Erro ao atualizar dados do usuário.');
            }
        } catch (error) {
            setError('Erro ao atualizar dados do usuário.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:3001/delete/user/${userId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                const data = await response.json();
                setError(data.msg || 'Erro ao deletar usuário.');
            }
        } catch (error) {
            setError('Erro ao deletar usuário.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container">
            <h2 className="mt-4">Perfil</h2>
            {user && (
                <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nome</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Nova Senha (opcional)</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={user.password || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>Atualizar</button>
                    <button type="button" className="btn btn-danger ms-2" onClick={handleDelete} disabled={loading}>Deletar Conta</button>
                </form>
            )}
        </div>
    );
}

export default Profile;
