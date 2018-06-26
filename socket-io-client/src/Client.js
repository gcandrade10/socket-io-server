import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import swal from 'sweetalert';

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      nombre: "",
      correo: "",
      codigo: "",
      step:0
    };
    this.handleChangeNombre = this.handleChangeNombre.bind(this);
    this.handleChangeCorreo = this.handleChangeCorreo.bind(this);
    this.handleChangeCodigo = this.handleChangeCodigo.bind(this);
	this.handleChangeAbierta = this.handleChangeAbierta.bind(this);


    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleSubmitFinal = this.handleSubmitFinal.bind(this);

    
  }

  handleChangeNombre(event) {
    this.setState({nombre: event.target.value});
  }
  handleChangeCorreo(event) {
    this.setState({correo: event.target.value});
  }
  handleChangeCodigo(event) {
    this.setState({codigo: event.target.value});
  }
   handleChangeAbierta(event) {
    this.setState({abierta: event.target.value});
  }

  handleSubmit(event) {
    const { endpoint } = this.state;
    this.socket= socketIOClient(endpoint);
    this.info = {nombre:this.state.nombre, correo:this.state.correo, codigo:this.state.codigo};
	this.socket.emit("Registro", this.info);

	this.setState({step: 1});


    this.socket.on("question", data => {
    	console.log(data);
    	this.setState({ step : 2, question:data })
    	}	
    );
    event.preventDefault();
    swal("Registro exitoso!", this.state.nombre+"\t"+this.state.correo+"\t"+this.state.codigo, "success");
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


  render() {
    


    	switch (this.state.step) {
    	case 0:
        return (
	       <form onSubmit={this.handleSubmit}>
	        <label>
	          Nombre:
	          <input type="text" value={this.state.nombre} onChange={this.handleChangeNombre} />
	          <br/>
	          Correo:
	          <input type="text" value={this.state.correo} onChange={this.handleChangeCorreo} />
	          <br/>
	          Codigo:
	          <input type="text" value={this.state.codigo} onChange={this.handleChangeCodigo} />
	          <br/>
	          
	        </label>
	        <input type="submit" value="Submit" />
	      </form>
		);
        break;
        case 1:
        return <div>waiting players</div>
        break;
        case 2:
        return this.renderOptions();
        break;
   
		}

    
  }
}
export default Admin;