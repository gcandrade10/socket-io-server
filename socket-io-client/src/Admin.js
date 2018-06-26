import React, { Component } from "react";
import socketIOClient from "socket.io-client";

let Timer = require('easytimer');
let timerInstance = new Timer();

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
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
  }

  renderUsers()
  {
    return<div>
        <ol>
            
          {this.state.response.map(
            (f)=>
            <li key={f.codigo+f.nombre}> 

              <div class="linea">
                <div class="col-lg-4">{f.nombre}</div>
                <div class="col-lg-6">{f.correo}</div>
                <div class="col-lg-6">{f.codigo}</div>
              </div>
            </li>
            )
          }
        </ol>
        <button type="button"
              onClick= {() =>{
                  this.setState({
            step :1
          });
          fetch("/api/play");


                }}
            >Play
        </button>
      </div>
  }

  render() {

    switch (this.state.step) {
      case 0:
        const { response } = this.state;
        return (
            <button type="button"
              onClick= {() =>{
                  this.setState({
            step :1
          });
          fetch("/api/reset");


                }}
            >Start new game</button>);
        break;

      case 1:

      return (
          <div style={{ textAlign: "center" }}>
            {this.state.response
              ?
              this.renderUsers()
              : <p>Loading...</p>}

               
          </div>
        );
      break;

      case 2:
      return <div>
        <div>{this.state.time}</div>
        <br/>
      <div>{this.state.question.text}</div>
      </div>
      break;
 
    }

    
  }
}
export default Admin;