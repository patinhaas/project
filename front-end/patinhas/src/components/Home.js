import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const [donations, setDonations] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    date: '',
    ongName: ''
  });

  useEffect(() => {
    async function fetchDonations() {
      try {
        const response = await fetch('http://localhost:3001/listAll/api/donations'); // Rota para obter doações
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error('Erro ao obter doações:', error);
      }
    }

    fetchDonations();
  }, []); // Executa apenas uma vez após a montagem do componente

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria((prevCriteria) => ({
      ...prevCriteria,
      [name]: value
    }));
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/donations?date=${filterCriteria.date}&ongName=${filterCriteria.ongName}`); // Rota para filtrar doações
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error('Erro ao filtrar doações:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Doações</h1>
      <form className="mb-4" onSubmit={handleFilterSubmit}>
        <div className="row">
          <div className="col-md-3">
            <label htmlFor="date" className="form-label">Data:</label>
            <input type="date" className="form-control" id="date" name="date" value={filterCriteria.date} onChange={handleFilterChange} />
          </div>
          <div className="col-md-4">
            <label htmlFor="ongName" className="form-label">Nome da ONG:</label>
            <input type="text" className="form-control" id="ongName" name="ongName" value={filterCriteria.ongName} onChange={handleFilterChange} />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary mt-4">Filtrar</button>
          </div>
        </div>
      </form>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {donations.map((donation) => (
          <div key={donation.id} className="col">
            <div className="card">
              <img src={donation.image} className="card-img-top" alt="Donation" />
              <div className="card-body">
                <h5 className="card-title">{donation.name}</h5>
                <p className="card-text">{donation.description}</p>
                <Link to={`/donations/${donation.id}`} className="btn btn-primary">Detalhes</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-5" />

      <div className="mt-5">
        <h2>Parceiros</h2>
        <p>Aqui você pode adicionar informações sobre como as pessoas podem ajudar ou sobre seus parceiros.</p>
      </div>
    </div>
  );
}

export default Home;
