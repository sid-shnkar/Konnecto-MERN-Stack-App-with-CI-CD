# Konnecto-MERN-Stack-App-with-CI-CD

Frontend deployment link - https://konnecto-app.netlify.app/

Backend deployment link - https://konnecto-app-backend-service.onrender.com

Gitlab CI/CD Repo - https://gitlab.com/sidshnkar/konnecto-app-postman-newman-ci-cd

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Description](#description)
  * [Technologies Used](#technologies-used)
  * [List of Features](#list-of-features)
  * [Screenshots](#screenshots)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Commands Used](#commands-used)



<!-- ABOUT THE PROJECT -->
## About The Project

### Description

Konnecto MERN Stack App is a social media platform where users can connect with each other, by creating new posts, liking and commenting on each other's posts, adding users to friend list, and live chat with any friend of their choice. This App has automated CI/CD pipeline which involves building, testing and deployment, using GitLab, Postman, Newman and Jenkins.

For the Devops part of this project, I created a CI/CD pipeline on GitLab, which consists of build, tests, and deployment stages. In the testing stage, along with testing of the frontend and backend part of this project, the Postman Collection containing all the APIs in the backend is also tested using Newman reporters such as cli, htmlextra, and junit. The reports of the testing are generated in HTML and XML format, and are also tested for deployment. Also, I have integrated a Jenkins server to automate this testing process.

### Technologies used

* React.js
* Node.js
* MongoDB
* Socket.io
* Postman
* Newman
* GitLab CI/CD
* Jenkins

### List of Features

* Login/Logout an User
* Register a new User
* View User Profile
* View all Users Posts
* View current User Posts
* Create a New Post
* Like/Unlike a Post
* View Comments on Post
* Create a Comment on Post
* Add/Remove Friend in Friend List
* Light/Dark mode switching
* Live Chat with Friends


### Screenshots

![screenshot-1](pics/konnecto-app-register.png)
![screenshot-2](pics/konnecto-app-home.png)
![screenshot-3](pics/konnecto-chat.png)
![screenshot-4](pics/gitlab-final-pipeline-working.png)
![screenshot-5](pics/jenkins-newman-konnecto-app-testing-p1.png)
![screenshot-6](pics/jenkins-newman-konnecto-app-testing-p2.png)
![screenshot-7](pics/newman-cli-powershell.png)
![screenshot-8](pics/newman-htmlextra-jenkins.png)
![screenshot-9](pics/newman-htmlextra-jenkins-p2.png)
![screenshot-10](pics/postman_collection_runner_new_deployment_link.png)

<!-- GETTING STARTED -->
## Getting Started

To get started with the project, follow these steps:

### Prerequisites

* Create a new .env file in client folder whose contents are as follows -
```sh
VITE_BASE_URL=
```
Assign the above variable a value that is the base url for your backend sever (can be localhost or thirdy party deployement link)

* Create a new .env file in server folder whose contents are as follows -
```sh
MONGO_URL=
PORT=
JWT_SECRET=
```
Assign the above variables the values that corresponds to your mongoDB database connection string, port for backend server and jwt secret for signing auth token.

### Commands used

Inside both the client and server folder, run the following command - 
```sh
npm run dev
```
