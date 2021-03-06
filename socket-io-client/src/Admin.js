import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import './admin.css';
import Footer from './Footer.js';
import Header from './Header.js';



class Admin extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      //endpoint: process.env.ENDPOINT || "127.0.0.1:4001",
      endpoint: "https://afternoon-depths-66584.herokuapp.com/#",
      step:0
    };

    this.renderScoreboard = this.renderScoreboard.bind(this);

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

    this.socket.on("question4", data => {
      this.setState({ step : 5, question:data })
    });

    this.socket.on("clients", data => {
    	this.setState({ response: data })
    });

    this.socket.on("final", info => {
      function compare(a,b) {
        if (a.tiempo < b.tiempo)
          return -1;
        if (a.tiempo > b.tiempo)
          return 1;
        return 0;
      }
      info.sort(compare);
      this.setState({ step : 6, info: info })
    }); 
  }


  renderScoreboard(){
    return <div className="players-list container">
    {this.state.info.map(
      (f)=> <div className="row player" key={f.nombre}>
          <img className="col-sm-3 img-responsive" 
            src="./login_icon.png"
            alt="login icon" />
          <div className="col-sm-9">
            <h2 className="player-name">
              {f.nombre} - {f.tiempo}
            </h2>
          </div>
        </div>
      )}
    </div>;
  }

  renderUsers()
  {
    return <div className="players-list container">
        <h1 className="players">
          Jugadores
        </h1>
            
          {this.state.response.map(
            (f)=>
            <div className="row player" key={f.nombre}>
              <img className="col-sm-3 img-responsive" 
                src="./login_icon.png"
                alt="login icon" />
              <div className="col-sm-9">
                <h2 className="player-name">
                  Jugador - {f.nombre}
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
          <div>
          <Header />
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
          </div>
          </div>);
        
      case 1:
      return (
        <div>
          <Header />
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
         <div className="admin-general"
          style={{ textAlign: "center" }}>
              <h1>¡Felicitaciones!</h1>
              {this.renderScoreboard()}
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