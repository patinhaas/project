import React, { Component } from 'react';
import axios from 'axios';
import { FaCamera } from 'react-icons/fa'; // Importando ícone para a foto
import 'bootstrap/dist/css/bootstrap.min.css';
import rulesImage from '../imgs/highfive.webp';

export default class RegisterDonation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      photoUrl: null,
      description: '',
      contactNumber: '',
      successMessage: '',
      errorMessage: ''
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFileChange = (event) => {
    this.setState({ photoUrl: event.target.files[0] });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { name, photoUrl, description, contactNumber } = this.state;

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('photoUrl', photoUrl);
    formData.append('description', description);
    formData.append('contactNumber', contactNumber);
    formData.append('userId', userId.toString()); 

    try {
      const response = await axios.post('http://localhost:3001/register/donations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Doação cadastrada com sucesso:', response.data);
      this.setState({ 
        successMessage: 'Doação cadastrada com sucesso!',
        errorMessage: '',
        name: '',
        photoUrl: null,
        description: '',
        contactNumber: ''
      });
    } catch (error) {
      console.error('Erro ao cadastrar doação:', error);
      this.setState({ 
        errorMessage: 'Erro ao cadastrar doação. Por favor, tente novamente.',
        successMessage: ''
      });
    }
  };

  render() {
    const { name, description, contactNumber, successMessage, errorMessage } = this.state;

    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow p-4" style={{ borderRadius: '15px', border: 'none', backgroundColor: '#f8f9fa' }}>
              <h5 className="card-header bg-primary text-white text-center" style={{ borderRadius: '10px 10px 0 0', border: 'none' }}>Cadastrar Nova Doação</h5>
              <div className="card-body">
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="mb-4">
                  <img src={rulesImage} alt="Regras de Cadastro" className="img-fluid" style={{ borderRadius: '10px' }} />
                </div>
                <p className="mb-4">Antes de prosseguir com o cadastro da doação, por favor, leia atentamente nossas regras:</p>
                <ul className="mb-4">
                  <li>Todas as doações devem ser legais e não infringir leis locais ou internacionais.</li>
                  <li>A descrição do produto deve ser clara e precisa, sem informações falsas.</li>
                  <li>As fotos devem representar fielmente o produto doado.</li>
                  <li>Forneça um número de contato válido para que possamos entrar em contato se necessário.</li>
                </ul>
                <form onSubmit={this.handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nome do Produto:</label>
                    <input type="text" className="form-control" id="name" name="name" value={name} onChange={this.handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descrição do Produto:</label>
                    <textarea className="form-control" id="description" name="description" value={description} onChange={this.handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="photo" className="form-label">Foto do Produto:</label>
                    <div className="input-group">
                      <input type="file" accept="image/*" className="form-control" id="photo" onChange={this.handleFileChange} required />
                      <label htmlFor="photo" className="input-group-text" style={{ backgroundColor: '#A6D6D5', color: '#333', cursor: 'pointer', borderRadius: '0 10px 10px 0' }}><FaCamera /></label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contactNumber" className="form-label">Número de Contato:</label>
                    <input type="text" className="form-control" id="contactNumber" name="contactNumber" value={contactNumber} onChange={this.handleChange} required />
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#A6D6D5', borderColor: '#A6D6D5', borderRadius: '10px', padding: '10px 30px' }}>Criar Produto</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
