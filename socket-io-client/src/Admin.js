import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import './admin.css';
import Footer from './Footer.js';



class Admin extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      //endpoint: process.env.ENDPOINT || "127.0.0.1:4001",
      endpoint: "https://afternoon-depths-66584.herokuapp.com",
      step:0
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    this.socket= socketIOClient(endpoint);

    this.socket.on("question1", data => {
      this.setState({ step : 2, question:data })
    });

    this.socket.on("question2", data => {
      this.setState({ step : 4, question:data })
    });

    this.socket.on("question3", data => {
      this.setState({ step : 5, question:data })
    });

    this.socket.on("clients", data => {
    	this.setState({ response: data })
    });

    this.socket.on("final", info => {
      this.setState({ step : 6 })
    }); 
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
          fetch("/api/play");
          }}
            >Jugar
        </button>
      </div>
  }

  render() {
    console.log("step",this.state.step);
    switch (this.state.step) {
      case 0:
        return (
          <div className="admin-general">
            <button type="button"
              className="btn start-game"
              onClick= {() =>{
                  this.setState({
                    step :1,
                  });
              fetch("/api/reset",{cache: "no-cache"});
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
            <div className="question">
              <h1>{this.state.question.text}</h1>
            </div>
            
          </div>
          <Footer />
        </div>);

      case 4:
      return (
        <div className="admin-general">
          <div className="admin-question">
            <div className="question">
              <h1>{this.state.question.text}</h1>
            </div>            
          </div>
          <Footer />
        </div>);

      case 5:
      return (
        <div className="admin-general">
          <div className="admin-question">
            <div className="question">
              <h1>{this.state.question.text}</h1>
            </div>            
          </div>
          <Footer />
        </div>);

      case 6:
      return (
        <div className="admin-general">
          <div className="admin-question">
            <div className="question">
              <h1>Scoreboard</h1>
              <button type="button"
              className="btn start-game"
              onClick= {() =>{
                  this.setState({
                    step :1
                  });
              fetch("/api/reset",{cache: "no-cache"});
              }}>
              Nuevo juego
            </button>
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