import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class HomeUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      contactNumber: '',
      photoUrl: null,
      productData: [],
      isLoading: false,
      error: null,
      isEditing: false,
      productId: null,
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;
    this.handleGetUserDonations(userId);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleImageChange = (event) => {
    this.setState({
      photoUrl: URL.createObjectURL(event.target.files[0])
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { name, description, contactNumber, photoUrl, productId } = this.state;
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;
  
    try {
      this.setState({ isLoading: true });
      if (productId) {
        await axios.put(`http://localhost:3001/update/donations/${productId}`, {
          name,
          description,
          contactNumber,
          photoUrl,
        });
      } else {
        await axios.post('http://localhost:3001/register/donations', {
          name,
          description,
          contactNumber,
          photoUrl,
          userId,
        });
      }
      await this.handleGetUserDonations(userId); // Atualiza a lista de produtos após a criação ou edição
      this.clearForm();
      this.setState({ isLoading: false });
    } catch (error) {
      console.error('Erro ao cadastrar/editar doação:', error);
      this.setState({ error: 'Erro ao cadastrar/editar doação', isLoading: false });
    }
  };  

  handleGetUserDonations = async (userId) => {
    try {
      this.setState({ isLoading: true });
      const response = await axios.get(`http://localhost:3001/list/donations/${userId}`);
      this.setState({ productData: response.data, isLoading: false });
    } catch (error) {
      console.error('Erro ao buscar as doações do usuário:', error);
      this.setState({ error: 'Erro ao buscar as doações do usuário', isLoading: false });
    }
  };

  handleEditDonation = (donation) => {
    this.setState({
      name: donation.name,
      description: donation.description,
      contactNumber: donation.contactNumber,
      photoUrl: donation.photoUrl,
      isEditing: true,
      productId: donation.id,
    });
  };

  handleDeleteDonation = async (donationId) => {
    try {
      this.setState({ isLoading: true });
      await axios.delete(`http://localhost:3001/delete/donations/${donationId}`);
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user.id;
      await this.handleGetUserDonations(userId); // Atualiza a lista de produtos após a exclusão
      this.setState({ isLoading: false });
    } catch (error) {
      console.error('Erro ao deletar doação:', error);
      this.setState({ error: 'Erro ao deletar doação', isLoading: false });
    }
  };

  clearForm = () => {
    this.setState({
      name: '',
      description: '',
      photoUrl: null,
      contactNumber: '',
      isEditing: false,
      productId: null,
    });
  };

  render() {
    const { name, description, contactNumber, photoUrl, productData, isLoading, isEditing } = this.state;

    return (
      <div className="container">
        <div className="row mt-3">
          <div className="col">
            <h1>{isEditing ? 'Editar Produto' : 'Cadastrar Produto'}</h1>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>Nome do Produto:</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descrição do Produto:</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={description}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Numero de Contato:</label>
                <input
                  type="text"
                  className="form-control"
                  name="contactNumber"
                  value={contactNumber}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Imagem do Produto:</label>
                <input
                  type="file"
                  className="form-control-file"
                  onChange={this.handleImageChange}
                />
              </div>
              {photoUrl && (
                <img src={photoUrl} alt="Product" className="img-fluid mb-2" style={{ maxHeight: '200px' }} />
              )}
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Salvar Produto' : 'Criar Produto'}
              </button>
            </form>
          </div>
          <div className="col">
            <h2>Produtos Cadastrados</h2>
            {isLoading ? (
              <p>Carregando...</p>
            ) : (
              productData.map((product) => (
                <div key={product.id} className="card my-2">
                  <div className="card-body">
                    <p>Nome: {product.name}</p>
                    <p>Descrição: {product.description}</p>
                    <p>Numero de Contato: {product.contactNumber}</p>
                    <button
                      className="btn btn-warning mr-2"
                      onClick={() => this.handleEditDonation(product)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => this.handleDeleteDonation(product.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
}
