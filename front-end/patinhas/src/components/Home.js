import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import imgAbout from '../imgs/highfive.webp';
import { FaSearch } from 'react-icons/fa';

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

  const handleImageError = (event) => {
    event.target.src = 'fallback-image-url.jpg';
  };

  return (
    <div className="container mt-5">
        <div className="row">
            <div className="col-md-6 d-flex align-items-center">
                <div className="p-4">
                    <h2 style={{ fontSize: '2.5rem', color: '#907FA4', textAlign: 'center', fontFamily: 'Oswald, sans-serif' }}>Patinhas</h2>
                    <p style={{ fontSize: '1.1rem', color: '#666', textAlign: 'center', fontFamily: 'Roboto, sans-serif' }}>
                        O Patinhas é uma plataforma dedicada a conectar corações generosos com a missão vital das ONGs de animais.
                        Aqui, as ONGs têm a oportunidade de registrar suas necessidades específicas, desde suprimentos essenciais até tratamentos veterinários urgentes.
                        Com apenas alguns cliques, estas organizações podem comunicar suas necessidades com clareza e eficácia.
                    </p>
                </div>
            </div>
            <div className="col-md-6 d-flex justify-content-center align-items-center">
                <img src={imgAbout} alt="Imagem Projeto" className="img-fluid" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
            </div>
        </div>

        <hr className="my-5" />

        <h1 className="mb-4 text-center" style={{ color: '#907FA4' }}>Doações</h1>
        <form className="mb-4" onSubmit={handleFilterSubmit}>
            <div className="row justify-content-center">
                <div className="col-md-3">
                    <label htmlFor="date" className="form-label">Data:</label>
                    <input type="date" className="form-control" id="date" name="date" value={filterCriteria.date} onChange={handleFilterChange} />
                </div>
                <div className="col-md-3">
                    <label htmlFor="ongName" className="form-label">Nome da ONG:</label>
                    <input type="text" className="form-control" id="ongName" name="ongName" value={filterCriteria.ongName} onChange={handleFilterChange} />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#907FA4', borderColor: '#907FA4', height: '38px' }}>
                        <FaSearch />
                    </button>
                </div>
            </div>
        </form>

        <div className="row row-cols-1 row-cols-md-3 g-4">
            {donations.map((donation) => (
                <div key={donation.id} className="col">
                    <div className="card shadow-sm">
                        <img
                            src={`http://localhost:3001${donation.photoUrl}`}
                            className="card-img-top"
                            alt="Donation"
                            onError={handleImageError}
                        />
                        <div className="card-body">
                            <h5 className="card-title" style={{ fontSize: '1.2rem', color: '#907FA4' }}>{donation.name}</h5>
                            <p className="card-text">{donation.description}</p>
                            <p className="card-text">Data de Criação: {new Date(donation.createdAt).toLocaleDateString()}</p> {/* Mostra a data de criação */}
                            <Button variant="primary" onClick={() => handleShowModal(donation)} style={{ backgroundColor: '#907FA4', borderColor: '#907FA4' }}>Detalhes</Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <hr className="my-5" />

        <div className="mt-5">
            <h2 style={{ color: '#907FA4' }}>Parceiros</h2>
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
                        <img
                            src={`http://localhost:3001${selectedDonation.photoUrl}`}
                            alt="Donation"
                            className="img-fluid"
                            onError={handleImageError}
                        />
                        <p>Data: {selectedDonation.date}</p>
                        <p>ONG: {selectedDonation.ongName}</p>
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
