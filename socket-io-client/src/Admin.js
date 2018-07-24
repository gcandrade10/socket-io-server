import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import './admin.css';
import Footer from './Footer.js';

let Timer = require('easytimer');
let timerInstance = new Timer();

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: process.env.ENDPOINT || "127.0.0.1:4001",
      step:0
    };
  }


  startTimer()
  {
    setInterval(this.update.bind(this), 1000);
  }

  update()
  {
    console.log(timerInstance.getTimeValues().toString());
    this.setState({
      time :timerInstance.getTimeValues().toString()
    });
  }



  componentDidMount() {
    const { endpoint } = this.state;
    this.socket= socketIOClient(endpoint);
    this.socket.on("clients", data => {
    	console.log(data);
    	this.setState({ response: data })
    });

    this.socket.on("question", data => {
      console.log(data);
      this.setState({ step : 2, question:data })
      console.log("empieza el tiempo");
      timerInstance = new Timer();
      timerInstance.start();
      this.startTimer();
    });

    this.socket.on("bienvenida", data => {
      console.log(data);
      this.setState({ step : 0, question:data })
      } 
    );
  }

  renderUsers()
  {
    return<div className="players-list container">
        <h1 className="players">
          <bold>Jugadores</bold>
        </h1>
            
          {this.state.response.map(
            (f)=>
            <div className="row player" key={f.nombre}>
              <img className="col-sm-4 img-responsive" 
                src="./login_icon.png"
                alt="login icon" />
              <div className="col-sm-8">
                <h2 className="player-name">
                  <bold>Jugador - {f.nombre}</bold>
                </h2>
              </div>
            </div>
            )
          }
          <br />
        <button 
          className="btn start-game"
          type="button"
          onClick= {() =>{
            this.setState({
            step :1
          });
          fetch("/api/play");
          }}
            >Jugar
        </button>
      </div>
  }

  render() {

    switch (this.state.step) {
      case 0:
        return (
          <div className="admin-general">
            <button type="button"
              className="btn start-game"
              onClick= {() =>{
                  this.setState({
                    step :1
                  });
              fetch("/api/reset");
              }}>
              Nuevo juego
            </button>
            <Footer />
          </div>);
        
      case 1:
      return (
          <div className="admin-general"
          style={{ textAlign: "center" }}>
            {this.state.response
              ?
              this.renderUsers()
              : <div className="waiting">
                  <h1>Esperando a los jugadores</h1>
                </div>}  
            <Footer />          
          </div>
        );

      case 2:
      return (
        <div className="admin-general">
          <div className="admin-question">
            <div className="timer">
              {this.state.time}
            </div>
            <br/>
            <div className="question">
              <h1>{this.state.question.text}</h1>
            </div>
            
          </div>
          <Footer />
        </div>);
 
      default:
        return (
          <div className="admin-general">
            Hay un error en el switch de Admin.js
            <Footer />
          </div>);
    }

    
  }
}
export default Admin;