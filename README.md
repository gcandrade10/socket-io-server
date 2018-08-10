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
