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
      isEditingModalOpen: false,
      productId: null,
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;
    this.handleGetUserDonations(userId);
  }

  handleChange = (event, fieldName) => {
    const { value } = event.target;
    this.setState({ [fieldName]: value });
  };

  handleImageChange = (event) => {
    this.setState({
      photoUrl: URL.createObjectURL(event.target.files[0])
    });
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
      isEditingModalOpen: true,
      productId: donation.id,
    });
  };

  handleDeleteDonation = async (donationId) => {
    try {
      this.setState({ isLoading: true });
      await axios.delete(`http://localhost:3001/delete/donations/${donationId}`);
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user.id;
      await this.handleGetUserDonations(userId); 
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
      isEditingModalOpen: false,
      productId: null,
    });
  };

  // Método para abrir o modal de edição
  openEditModal = () => {
    this.setState({ isEditingModalOpen: true });
  };

  // Método para fechar o modal de edição
  closeEditModal = () => {
    this.setState({ isEditingModalOpen: false });
  };

  // Método para lidar com a submissão do formulário de edição
  handleEditSubmit = async () => {
    const { productId, name, description, contactNumber } = this.state;
    try {
      await axios.put(`http://localhost:3001/update/donations/${productId}`, {
        name,
        description,
        contactNumber,
      });
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user.id;
      await this.handleGetUserDonations(userId);
      this.closeEditModal();
      this.clearForm();
    } catch (error) {
      console.error('Erro ao editar doação:', error);
    }
  };

  render() {
    const { productData, isLoading, isEditingModalOpen } = this.state;

    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-6">
            <h2 className="mb-4">Bem-vindo à Plataforma de Doações</h2>
            <p>
              Aqui você pode encontrar doações disponíveis e visualizar as doações que você cadastrou.
            </p>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-lg-12">
            <h2 className="mb-4">Suas Doações</h2>
            {isLoading ? (
              <p>Carregando...</p>
            ) : (
              <div className="row">
                {productData.map((product) => (
                  <div key={product.id} className="col-lg-4 mb-4">
                    <div className="card h-100">
                      <img src={product.photoUrl} className="card-img-top" alt="Product" />
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">{product.description}</p>
                        <p className="card-text">Contato: {product.contactNumber}</p>
                      </div>
                      <div className="card-footer">
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal de Edição */}
        {isEditingModalOpen && (
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar Doação</h5>
                  <button type="button" className="close" onClick={this.closeEditModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="editName">Nome</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editName"
                        value={this.state.name}
                        onChange={(e) => this.handleChange(e, 'name')}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="editDescription">Descrição</label>
                      <textarea
                        className="form-control"
                        id="editDescription"
                        rows="3"
                        value={this.state.description}
                        onChange={(e) => this.handleChange(e, 'description')}
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="editContactNumber">Número de Contato</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editContactNumber"
                        value={this.state.contactNumber}
                        onChange={(e) => this.handleChange(e, 'contactNumber')}
                      />
                    </div>
                    {/* Adicione mais campos conforme necessário */}
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={this.closeEditModal}
                  >
                    Fechar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.handleEditSubmit}
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }
}    