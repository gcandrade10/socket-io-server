import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import swal from 'sweetalert';
import './client.css';

class Client extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
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

  }

  sendCerrada()
  {
  	this.socket.emit("cerrada", 1);
  	swal("Respuesta enviada", "success");
  }

  componentDidMount()
  {
  	const { endpoint } = this.state;
    this.socket= socketIOClient(endpoint);
    
    this.socket.on("bienvenida", data => {
    	console.log(data);
    	this.setState({ step : -1, question:data })
    	}	
    );

    this.socket.on("question", data => {
    	console.log(data);
    	this.setState({ step : 2, question:data })
    	}	
    );
  }

  renderOptions()
  {
  	if(this.state.question.abierta)
  	{
  		return (
	       <form onSubmit={this.handleSubmitFinal}>
	        <label>
	          Nombre:
	          <input type="text" value={this.state.abierta} onChange={this.handleChangeAbierta} />         
	        </label>
	        <input type="submit" value="Submit" />
	      </form>
		);
  	}
  	else
  	{
  		return <div>

  		<button type="button"
        	onClick= {() =>{
            	this.setState({
            	cerrada :this.state.question.op1
          		});
          		this.sendCerrada();
            }}
        >{this.state.question.op1}
        </button>

        <button type="button"
        	onClick= {() =>{
            	this.setState({
            	cerrada :this.state.question.op2
          		});
          		this.sendCerrada();
            }}
        >{this.state.question.op2}
        </button>

        <button type="button"
        	onClick= {() =>{
            	this.setState({
            	cerrada :this.state.question.op3
          		});
          		this.sendCerrada();
            }}
        >{this.state.question.op3}
        </button>

        <button type="button"
        	onClick= {() =>{
            	this.setState({
            	cerrada :this.state.question.op4
          		});
          		this.sendCerrada();
            }}
        >{this.state.question.op4}
        </button>
  			
  		</div>
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
        <div className="header">
                    <img className="image-banner"
                          src="./uniandes.png"
                          alt="uniandes logo" />
        </div>
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
      </div>
		);
        case 1:
        return (<div className="client-general">
                  <div className="header">
                    <img className="image-banner"
                          src="./uniandes.png"
                          alt="uniandes logo"/>
                  </div>
                  <div className="waiting">
                  <h1>Espera mientras se registran los demás jugadores</h1>
                  </div>
                </div>);
        
        case 2:
        return (<div className="client-general">{this.renderOptions()}</div>);

        default:
        return (<div className="client-general">{this.state.question}</div>);
   
		}

    
  }
}
export default Client;