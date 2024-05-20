import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    } catch (error) {
      console.error('Erro ao cadastrar doação:', error);
    }
  };


  handleGetProduct = async () => {
    const { productId } = this.state;
    try {
      const response = await axios.get(`/list/donations/${productId}`);
      this.setState({ productData: response.data });
    } catch (error) {
      console.error('Erro ao consultar produto:', error);
    }
  };

  handleGetAllProducts = async () => {
    try {
      const response = await axios.get('/list/donations');
      this.setState({ productData: response.data });
    } catch (error) {
      console.error('Erro ao buscar todos os produtos:', error);
    }
  };

  handleUpdateProduct = async () => {
    const { productId, name, photoUrl, description, contactNumber } = this.state;
    try {
      const response = await axios.put(`/update/donations/${productId}`, { name, photoUrl, description, contactNumber });
      console.log('Produto atualizado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  handleDeleteProduct = async (productIdToDelete) => {
    try {
      await axios.delete(`/delete/donations/${productIdToDelete}`);
      console.log('Produto deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  render() {
    const { name, description, photoUrl, contactNumber, productId, productData } = this.state;

    return (
      <div className="container">
        <header className="App-header">
          <h1>Criar, Consultar, Atualizar e Excluir Produto</h1>
          <form onSubmit={this.handleSubmit}>
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
          <div>
            <h2>Consultar Produto</h2>
            <div className="form-group">
              <label>ID do Produto:</label>
              <input type="text" className="form-control" name="productId" value={productId} onChange={this.handleChange} />
            </div>
            <button className="btn btn-info" onClick={this.handleGetProduct}>Consultar</button>
          </div>
          <div>
            <h2>Buscar Todos os Produtos</h2>
            <button className="btn btn-success" onClick={this.handleGetAllProducts}>Buscar Todos</button>
            {productData && (
              <div>
                {Array.isArray(productData) ? (
                  <div>
                    <h3>Dados de Todos os Produtos:</h3>
                    {productData.map((product, index) => (
                      <div key={index} className="card my-2">
                        <div className="card-body">
                          <p>Nome: {product.name}</p>
                          <p>Descrição: {product.description}</p>
                          <p>Foto: {product.photoUrl}</p>
                          <p>Numero de Contato: {product.contactNumber}</p>
                          {product.createdAt && (
                            <p>Criado em: {product.createdAt}</p>
                          )}
                          {product.updatedAt && (
                            <p>Atualizado em: {product.updatedAt}</p>
                          )}
                          <button className="btn btn-warning mr-2" onClick={() => this.setState({ productId: product.id })}>Editar</button>
                          <button className="btn btn-danger" onClick={() => this.handleDeleteProduct(product.id)}>Excluir</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <h3>Dados do Produto:</h3>
                    <div className="card">
                      <div className="card-body">
                        <p>Nome: {productData.name}</p>
                        <p>Descrição: {productData.description}</p>
                        <p>Foto: {productData.photoUrl}</p>
                        <p>Numero de Contato: {productData.contactNumber}</p>
                        {productData.createdAt && (
                          <p>Criado em: {productData.createdAt}</p>
                        )}
                        {productData.updatedAt && (
                          <p>Atualizado em: {productData.updatedAt}</p>
                        )}
                        <button className="btn btn-warning mr-2" onClick={() => this.setState({ productId: productData.id })}>Editar</button>
                        <button className="btn btn-danger" onClick={() => this.handleDeleteProduct(productData.id)}>Excluir</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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
