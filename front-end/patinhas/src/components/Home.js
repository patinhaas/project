import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [donations, setDonations] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    date: '',
    ongName: ''
  });

  useEffect(() => {
    async function fetchDonations() {
      try {
        const response = await fetch('/api/donations'); // Rota para obter doações
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
    <div>
      <h1>Home</h1>
      <form onSubmit={handleFilterSubmit}>
        <label htmlFor="date">Data:</label>
        <input type="date" id="date" name="date" value={filterCriteria.date} onChange={handleFilterChange} />
        <label htmlFor="ongName">Nome da ONG:</label>
        <input type="text" id="ongName" name="ongName" value={filterCriteria.ongName} onChange={handleFilterChange} />
        {/* Adicione mais campos de entrada para outros critérios de filtro, se necessário */}
        <button type="submit">Filtrar</button>
      </form>

      <h2>Doações cadastradas:</h2>
      <div className="donation-cards">
        {donations.map((donation) => (
          <div key={donation.id} className="donation-card">
            <h3>{donation.name}</h3>
            <p>Descrição: {donation.description}</p>
           
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
