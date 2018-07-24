import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import swal from 'sweetalert';
import './client.css';
import Footer from './Footer.js';
import Header from './Header.js';

class Client extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      //endpoint: process.env.ENDPOINT || "127.0.0.1:4001",
      endpoint: "https://afternoon-depths-66584.herokuapp.com",
      nombre: "",
      codigo: "",
      step:0
    };
    this.handleChangeNombre = this.handleChangeNombre.bind(this);
    this.handleChangeCodigo = this.handleChangeCodigo.bind(this);
	  this.handleChangeAbierta = this.handleChangeAbierta.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitFinal = this.handleSubmitFinal.bind(this);
    this.renderName = this.renderName.bind(this);
    
  }

  handleChangeNombre(event) {
    this.setState({nombre: event.target.value});
  }
  handleChangeCodigo(event) {
    this.setState({codigo: event.target.value});
  }
   handleChangeAbierta(event) {
    this.setState({abierta: event.target.value});
  }

  handleSubmit(event) {
    
    this.info = {nombre:this.state.nombre, codigo:this.state.codigo};
	this.socket.emit("Registro", this.info);

	this.setState({step: 1});
  
    event.preventDefault();
    swal("Registro exitoso!", "Felicidades " + this.state.nombre + ". Te has registrado exitosamente!", "success");
  }

  handleSubmitFinal(event) {
	event.preventDefault();
	this.info.abierta=this.state.abierta;
	this.info.cerrada=this.state.cerrada;
	this.socket.emit("EntradaBD", this.info);
  	swal("Respuesta enviada", "success");
      this.setState({ step : 3});
    
  }

  sendCerrada()
  {
      this.setState({ step :3});
    this.socket.emit("cerrada", 1);
  	swal("Respuesta enviada", "success");
   
  }

  componentDidMount()
  {
  	const { endpoint } = this.state;
    this.socket= socketIOClient(endpoint);
    
    this.socket.on("bienvenida", data => {
    	console.log(data);
    	this.setState({ step : 0, question:data })
    	}	
    );

    this.socket.on("question", data => {
    	console.log(data);
    	this.setState({ step : 2, question:data })
    	}	
    );

    this.socket.on("start", data => {
      this.setState({ step : 0});
      } 
    );
    this.socket.on("end", data => {
      this.setState({ step : -3});
      } 
    );
  }

  renderOptions()
  {
  	if(this.state.question.abierta)
  	{
  		return (
        <div className="open-question">
           <h1>Responde</h1>
  	       <form 
            className="form-open"
            onSubmit={this.handleSubmitFinal}>
             <div className="form-group">	        
  	           <textarea 
                placeholder="Escribe aquí..."
                className="form-control"
                value={this.state.abierta} 
                onChange={this.handleChangeAbierta}
                rows="7"
                />          
  	         </div>
             <button 
              className="btn subscribe"
              type="submit" 
              value="Sumbit">
              Enviar
              </button>
  	       </form>
        </div>
		);
  	}
  	else
  	{
  		return (
        <div className="container closed-question">
          <div className="row"> 
      		  <button 
              className="btn option col-sm-6 form-group"
              type="button"
            	onClick = {() =>{
                	this.setState({
                	 cerrada :"Libertad"
              		});
              		this.sendCerrada();
              }}
            ><bold>a. Libertad</bold>
            </button>
            <button 
              className="btn option col-sm-6 form-group"
              type="button"
            	onClick= {() =>{
                	this.setState({
                	cerrada :"Excelencia"
              		});
              		this.sendCerrada();
                }}
            ><bold>c. Excelencia</bold>
            </button>
          </div>
          <div className="row">
            <button 
              className="btn option col-sm-6 pl-1 pr-1"
              type="button"
            	onClick= {() =>{
                	this.setState({
                	cerrada :"Solidaridad"
              		});
              		this.sendCerrada();
                }}
            ><bold>b. Solidaridad</bold>
            </button>

            <button 
              className="btn option col-sm-6 ml-1 mr-1"
              type="button"
            	onClick= {() =>{
                	this.setState({
                	cerrada :"Integridad"
              		});
              		this.sendCerrada();
                }}
            ><bold>d. Integridad</bold>
            </button>
  			   </div>
  		</div>);
  	}
  }

  renderName(username) {
    console.log(username);
    if (username !== ''){
      return ( ', '+ username );
    } else {
      return ('');
    }
    
  }


  render() {

    	switch (this.state.step) {
    	case 0:
        return (
        <div className="client-general">
        <Header />
        <div className="login-form">
          <div className="row row-title">
            <h1>Para iniciar, identifícate</h1>
          </div>
          <div className="row row-content">
          <div className="col-sm-1"/>
          <img className="col-sm-3 login-icon img-responsive" 
                src="./login_icon.png"
                alt="login icon" />
  	       <form className="col-sm-8" onSubmit={this.handleSubmit}>
             <div className="form-fields">
              <div className="form-group">  
    	         <label>Nombre</label>
    	          <input 
                  type="text" 
                  value={this.state.nombre} 
                  onChange={this.handleChangeNombre}
                  className="form-control"
                  required
                  autoFocus />
              </div>    
              <div className="form-group">
    	          <label>No. identificación</label>
    	          <input 
                  type="text" 
                  value={this.state.codigo} 
                  onChange={this.handleChangeCodigo}
                  className="form-control"
                  required
                  autoFocus />
    	        </div>
            </div>
  	        <button type="submit" className="btn subscribe">Jugar</button>
  	      </form>
        </div>
        </div>
        <Footer />
      </div>
		);
        case 1:
        return (<div className="client-general">
                  <Header />
                  <div className="waiting">
                  <h1><bold>Espera mientras se registran los demás jugadores</bold></h1>
                  </div>
                  <Footer />
                </div>);
        
        case 2:
        return (<div className="client-general">
                  <Header />
                  {this.renderOptions()}
                  <Footer />
                </div>);
        case -1:
        return (
            <div className="client-general">
                  <Header />
                  <div className="admin-question">
                    <h3>¡Gracias!</h3>
                  <h1>{this.state.question}</h1>
                  </div>
                  <Footer />
            </div>
          );
        case -3:
        return (
            <div className="client-general">
                  <Header />
                  <div className="waiting">
                    <h1>Aun no hay un juego para unirse</h1>
                 
                  </div>
                  <Footer />
            </div>
          );
        case 3:
        return (
            <div className="client-general">
                  <Header />
                  <div className="waiting">
                  <h1><strong>Espera mientras terminan los demás jugadores</strong></h1>
                  </div>
                  <Footer />
            </div>
          );
        default:
        return (<div className="client-general">
                  <Header />
                  {this.state.question}
                  <Footer />
                </div>);
   
		}

    
  }
}
export default Client;