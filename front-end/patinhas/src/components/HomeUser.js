import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUser from './HeaderUser'; // Importe o novo componente HeaderUser

export default class HomeUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      photoUrl: null,
      description: '',
      contactNumber: '',
      productId: '',
      productData: null,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { name, photoUrl, description, contactNumber } = this.state;

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;

    try {
      const response = await axios.post('/register/donations', { name, photoUrl, description, contactNumber, userId });
      console.log('Doação cadastrada com sucesso:', response.data);
      // Atualiza a lista de produtos após a criação
      this.handleGetAllProducts();
    } catch (error) {
      console.error('Erro ao cadastrar doação:', error);
    }
  };

  handleGetProduct = async () => {
    const { productId } = this.state;
    try {
      const response = await axios.get(`http://localhost:3001/list/donations/${productId}`);
      this.setState({ productData: response.data });
    } catch (error) {
      console.error('Erro ao consultar produto:', error);
    }
  };

  handleGetAllProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/list/donations');
      this.setState({ productData: response.data });
    } catch (error) {
      console.error('Erro ao buscar todos os produtos:', error);
    }
  };

  handleUpdateProduct = async () => {
    const { productId, name, photoUrl, description, contactNumber } = this.state;
    try {
      const response = await axios.put(`http://localhost:3001/update/donations/${productId}`, { name, photoUrl, description, contactNumber });
      console.log('Produto atualizado com sucesso:', response.data);
      // Atualiza a lista de produtos após a atualização
      this.handleGetAllProducts();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  handleDeleteProduct = async (productIdToDelete) => {
    try {
      await axios.delete(`http://localhost:3001/delete/donations/${productIdToDelete}`);
      console.log('Produto deletado com sucesso');
      // Atualiza a lista de produtos após a exclusão
      this.handleGetAllProducts();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  render() {
    const { name, description, photoUrl, contactNumber, productId, productData } = this.state;

    return (
      <div className="container">
        <HeaderUser /> {/* Renderize o novo header aqui */}
        <header className="App-header">
          <h1>Cadastrar</h1>
          <form onSubmit={this.handleSubmit}>
            {/* Formulário para criar um novo produto */}
            <div className="form-group">
              <label>Nome do Produto:</label>
              <input type="text" className="form-control" name="name" value={name} onChange={this.handleChange} required />
            </div>
            <div className="form-group">
              <label>Descrição do Produto:</label>
              <textarea className="form-control" name="description" value={description} onChange={this.handleChange} required />
            </div>
            <div className="form-group">
              <label>Foto do Produto:</label>
              <input type="file" accept="image/*" className="form-control" onChange={this.handleFileChange} required />
            </div>
            <div className="form-group">
              <label>Numero de Contato:</label>
              <input type="text" className="form-control" name="contactNumber" value={contactNumber} onChange={this.handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Criar Produto</button>
          </form>

          {/* Lista de produtos cadastrados */}
          <div>
            <h2>Produtos Cadastrados</h2>
            {productData && productData.map((product) => (
              <div key={product.id} className="card my-2">
                <div className="card-body">
                  <p>Nome: {product.name}</p>
                  <p>Descrição: {product.description}</p>
                  <p>Foto: {product.photoUrl}</p>
                  <p>Numero de Contato: {product.contactNumber}</p>
                  {/* Botões para atualizar e excluir o produto */}
                  <button className="btn btn-warning mr-2" onClick={() => this.setState({ productId: product.id })}>Editar</button>
                  <button className="btn btn-danger" onClick={() => this.handleDeleteProduct(product.id)}>Excluir</button>
                </div>
              </div>
            ))}
          </div>

          {/* Formulário para atualizar um produto existente */}
          {productId && (
            <div>
              <h2>Atualizar Produto</h2>
              <form onSubmit={this.handleUpdateProduct}>
                <div className="form-group">
                  <label>Nome do Produto:</label>
                  <input type="text" className="form-control" name="name" value={name} onChange={this.handleChange} required />
                </div>
                <div className="form-group">
                  <label>Descrição do Produto:</label>
                  <textarea className="form-control" name="description" value={description} onChange={this.handleChange} required />
                </div>
                <div className="form-group">
                  <label>Foto do Produto:</label>
                  <input type="file" accept="image/*" className="form-control" onChange={this.handleFileChange} required />
                </div>
                <div className="form-group">
                  <label>Numero de Contato:</label>
                  <input type="text" className="form-control" name="contactNumber" value={contactNumber} onChange={this.handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Atualizar</button>
              </form>
            </div>
          )}
        </header>
      </div>
    );
  }
}
