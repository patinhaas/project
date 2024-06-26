import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import imgAbout from '../imgs/highfive.webp';
import clubegato from '../imgs/clube_gato.webp';
import tocasegura from '../imgs/toca_segura.png'
import ficaComigo from '../imgs/fica.png'
import { FaSearch } from 'react-icons/fa';

const partnerImages = [
  { id: 1, url: tocasegura, alt: 'Clube do gato' },
  { id: 2, url: clubegato, alt: 'Toca segura' },
  { id: 3, url:ficaComigo , alt: 'Fica comigo' }
];

function Home() {
  const [donations, setDonations] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    date: '',
    ongName: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    fetchDonations(); // Fetch initial donations when component mounts
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch('http://localhost:3001/listAll/api/donations');
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error('Erro ao obter doações:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria((prevCriteria) => ({
      ...prevCriteria,
      [name]: value
    }));
  };

const [loading, setLoading] = useState(false);

const handleFilterSubmit = async (e) => {
  e.preventDefault();
  setLoading(true); // Set loading state to true while fetching data
  try {
    const url = `/api/donations?date=${filterCriteria.date}&ongName=${filterCriteria.ongName}`;
    const response = await fetch(url);
    const data = await response.json();
    setDonations(data);
  } catch (error) {
    console.error('Erro ao filtrar doações:', error);
  } finally {
    setLoading(false); // Set loading state to false after fetching data
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
    <div className="container-fluid">
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
          {donations.length > 0 ? (
            donations.map((donation) => (
              <div key={donation.id} className="col">
                <div className="card">
                  <img
                    src={`http://localhost:3001${donation.photoUrl}`}
                    className="card-img-top"
                    alt="Donation"
                    style={{ maxHeight: '200px' }}
                    onError={handleImageError}
                  />
                  <div className="card-body">
                    <h5 className="card-title" style={{ fontSize: '1.2rem', color: '#907FA4' }}>{donation.name}</h5>
                    <p className="card-text">{donation.description}</p>
                    <p className="card-text"><small className="text-muted">Data de Criação: {new Date(donation.createdAt).toLocaleDateString()}</small></p>
                  </div>
                  <div className="card-footer bg-transparent border-top-0">
                    <Button variant="primary" onClick={() => handleShowModal(donation)} style={{ backgroundColor: '#907FA4', borderColor: '#907FA4' }}>Detalhes</Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col text-center">
              <p>Nenhum resultado encontrado.</p>
            </div>
          )}
        </div>

        <hr className="my-5" />

        <div className="mt-5 mb-5"> {/* Adicione uma margem inferior suficiente para evitar que o footer sobreponha */}
          <h2 style={{ color: '#907FA4' }}>Organizações</h2>
          <p>Conheca algumas organizações em Brasilia.</p>

          <div className="row row-cols-1 row-cols-md-3 g-4">
            {partnerImages.map((partner) => (
              <div key={partner.id} className="col">
                <img src={partner.url} className="img-fluid" alt={partner.alt} />
              </div>
            ))}
          </div>
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

      <footer className="text-center py-4 bg-light">
        <p>&copy; 2024 Nome da Sua Empresa. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
