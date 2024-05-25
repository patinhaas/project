import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const [donations, setDonations] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    date: '',
    ongName: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    async function fetchDonations() {
      try {
        const response = await fetch('http://localhost:3001/listAll/api/donations'); 
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error('Erro ao obter doações:', error);
      }
    }

    fetchDonations();
  }, []);

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
      const response = await fetch(`/api/donations?date=${filterCriteria.date}&ongName=${filterCriteria.ongName}`); 
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error('Erro ao filtrar doações:', error);
    }
  };

  const handleShowModal = (donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDonation(null);
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
                <Button variant="primary" onClick={() => handleShowModal(donation)}>Detalhes</Button>
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes da Doação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDonation && (
            <>
              <h5>{selectedDonation.name}</h5>
              <p>{selectedDonation.description}</p>
              <img src={selectedDonation.image} alt="Donation" className="img-fluid" />
              <p>Data: {selectedDonation.date}</p>
              <p>ONG: {selectedDonation.ongName}</p>
              {/* Adicione mais detalhes conforme necessário */}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
