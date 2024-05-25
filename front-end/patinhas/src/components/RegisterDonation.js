import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RegisterDonation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      photoUrl: null,
      description: '',
      contactNumber: '',
      successMessage: ''
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
        name: '',
        photoUrl: null,
        description: '',
        contactNumber: ''
      });
    } catch (error) {
      console.error('Erro ao cadastrar doação:', error);
    }
  };

  render() {
    const { name, description, contactNumber, successMessage } = this.state;

    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <h5 className="card-header bg-primary text-white">Cadastrar Nova Doação</h5>
              <div className="card-body">
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
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
                    <input type="file" accept="image/*" className="form-control" id="photo" onChange={this.handleFileChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contactNumber" className="form-label">Número de Contato:</label>
                    <input type="text" className="form-control" id="contactNumber" name="contactNumber" value={contactNumber} onChange={this.handleChange} required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#80cc28', borderColor: '#80cc28' }}>Criar Produto</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
