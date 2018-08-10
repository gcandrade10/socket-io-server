# Preguntas uniandes

## Introduction

The main purpose of the application is to support the construction of community inside the University of Los Andes. It creates an application where there is two main roles: Admin and player. Each one of the users will be watching presented a different screen, but for the game to work the player should use both screens.

### Technical details
- This is an application build with a nodejs back-end and a react front-end.
- It has been developed through a continous-flow design.
- Every game is seen as a new cycle of the application.
- Every screen is realted to a step #x (being x a number).
- Both parts of the applications communicate with the backend and the later triggers changes, if needed, on both of the clients (Admin and Player).

### Flow diagram

The top part is the Player user flow, the bottom is the Admin user flow. In the middle of both flows is the communication with the backend and triggers from the backend. (All the diagram is just one line, it is separated in two lines because of the paper space).

![Image describing the flow of the application](https://i.imgur.com/bHxNnkB.jpg)

## Installation

To run this program in a machine it is necessary to clone or download the repository and open 2 terminals. Locate the first one on the main folder of the project and run npm install and npm start, and then go with the second terminal to the folder socket-io-client and run the same commands.

Also it is necesary to go to the Admin.js and Client.js inside the src folder inside the client folder and change the following lines:
  - //endpoint: process.env.ENDPOINT || "127.0.0.1:4001",
  - endpoint: "https://afternoon-depths-66584.herokuapp.com/#",
  - to:
  - endpoint: process.env.ENDPOINT || "127.0.0.1:4001",
  - //endpoint: "https://afternoon-depths-66584.herokuapp.com/#",
  
## Final deployment

To deploy it in a server the endpoint variable that is changed on the local run (look the point installation) to the final url in which the application will be deployed.
