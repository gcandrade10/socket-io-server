import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import swal from 'sweetalert';
import './client.css';
import Footer from './Footer.js';
import Header from './Header.js';
let Timer = require('easytimer');
let timerInstance = new Timer();

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
    this.renderOptionsClosed = this.renderOptionsClosed.bind(this);
    this.sendQuestion2 = this.sendQuestion2.bind(this);
    
  }

  startTimer() {
    setInterval(this.update.bind(this), 1000);
  }

  update() {
    this.setState({
      time :timerInstance.getTimeValues().toString()
    });
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
  event.preventDefault();
  this.info = {nombre:this.state.nombre, codigo:this.state.codigo};
	this.socket.emit("Register", this.info);
	this.setState({step: 1});
  swal("Registro exitoso!", "Felicidades " + this.state.nombre + ". Te has registrado exitosamente!", "success");
  }

  handleSubmitFinal(event) {
	event.preventDefault();
  timerInstance.stop();
  this.setState({ step : 5});
	this.info.abierta=this.state.abierta;
	this.info.cerrada=this.state.cerrada;
  console.log(timerInstance.getTimeValues().toString());
  this.setState({
    time :timerInstance.getTimeValues().toString()
  });
  this.info.tiempo=this.state.time;
	this.socket.emit("save", this.info);
	swal("Respuesta enviada", "success");
  
  }

  sendCerrada()
  {
    timerInstance.pause();
    this.setState({ step :6});
    this.socket.emit("question1", 1);
  	swal("Respuesta enviada", "Success");
  }

  sendQuestion2(){
    timerInstance.pause();
    this.setState({ step :6});
    this.socket.emit("question2", 1);
    swal("Respuesta enviada", "Success");
  }

  componentDidMount()
  {
  	const { endpoint } = this.state;
    this.socket= socketIOClient(endpoint);
    
    this.socket.on("start", data => {
      this.setState({ step : 0});
      } 
    );

    this.socket.on("question1", data => {
        console.log(data);
        this.setState({ step : 2, question:data })
        timerInstance = new Timer();
        timerInstance.start();
        this.startTimer();
    });

    this.socket.on("question2", data => {
      timerInstance.start();
      this.startTimer();
      console.log(data);
      this.setState({ step : 3, question:data })
    });

    this.socket.on("question3", data => {
      timerInstance.start();
      this.startTimer();
      console.log(data);
      this.setState({ step : 4, question:data })
    });

    this.socket.on("beggining", data => {
      console.log("entro aca a beggining");
      this.setState({ step : 0 })
      } 
    ); 
  }

  renderOptionsClosed(){
    return (
        <div className="container closed-question">
          <div className="row"> 
            <button 
              className="btn option col-sm-6 form-group"
              type="button"
              onClick = {() =>{
                  this.setState({
                   cerrada :this.state.question.op1
                  });
                  this.sendCerrada();
              }}
            ><strong>a. {this.state.question.op1}</strong>
            </button>
            <button 
              className="btn option col-sm-6 form-group"
              type="button"
              onClick= {() =>{
                  this.setState({
                  cerrada :this.state.question.op2
                  });
                  this.sendCerrada();
                }}
            ><strong>c. {this.state.question.op2}</strong>
            </button>
          </div>
          <div className="row">
            <button 
              className="btn option col-sm-6 pl-1 pr-1"
              type="button"
              onClick= {() =>{
                  this.setState({
                  cerrada :this.state.question.op3
                  });
                  this.sendCerrada();
                }}
            ><strong>b. {this.state.question.op3}</strong>
            </button>

            <button 
              className="btn option col-sm-6 ml-1 mr-1"
              type="button"
              onClick= {() =>{
                  this.setState({
                  cerrada :this.state.question.op4
                  });
                  this.sendCerrada();
                }}
            ><strong>d. {this.state.question.op4}</strong>
            </button>
           </div>
      </div>);
    
  }

  renderOptions()
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

  renderName(username) {
    console.log(username);
    if (username !== ''){
      return ( ', '+ username );
    } else {
      return ('');
    }
    
  }


  render() {

      console.log("step",this.state.step);
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
                  <h1><strong>Espera mientras se registran los demás jugadores</strong></h1>
                  </div>
                  <Footer />
                </div>);
        
        case 2:
        return (<div className="client-general">
                  <Header />
                  {this.renderOptionsClosed()}
                  <Footer />
                </div>);
        case 3:
        return (<div className="client-general">
                  <Header />
                  <div className="admin-question">
                  <h1><strong>¿Lo lograste?</strong></h1>
                  <br />
                  <button 
                    className="btn continue"
                    onClick= {() =>{
                      this.sendQuestion2();
                  }}>Continúa</button>
                  </div>
                  <Footer />
                </div>);
        case 4:
        return (<div className="client-general">
                  <Header />
                  {this.renderOptions()}
                  <Footer />
                </div>);
        case 5:
        return (
            <div className="client-general">
                  <Header />
                  <div className="admin-question">
                    <h3>¡Gracias!</h3>
                  <h1>Te damos la bienvenida y te invitamos a vivir diariamente los valores Uniandes.</h1>
                  </div>
                  <Footer />
            </div>
          );
        case 6:
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
                  Error
                  <Footer />
                </div>);
   
		}

    
  }
}
export default Client;