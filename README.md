# My Chat App - Real-time Chat Application

A full-stack, real-time chat application built with the **MERN** stack (MongoDB, Express, React, Node.js) and **Socket.io**. This application provides a seamless communication platform allowing users to register, log in, update their profiles, and chat with each other in real-time with rich media support.

---

## 🏗️ System Architecture & Workflow

The architecture is designed to handle both standard HTTP requests for data fetching/authentication and long-lived WebSocket connections for low-latency, bi-directional real-time communication.

### High-Level Architecture Diagram

```text
+-----------------------+              +------------------------+
|     Frontend App      |              | External Services & DB |
|                       |              |                        |
|  [ React 19 UI ]      |              |  [( MongoDB )]         |
|        ^ v            |              |        ^               |
|  [ Zustand State ]    |              |        |               |
+-----------------------+              |  [ Cloudinary ]        |
      |          |                     +--------^---------------+
      |          |                              |
 (HTTP/REST)  (WebSocket)                       |
      |          |                              |
      v          v                              |
+-----------------------------------------------+
|           Node.js / Express Server            |
|                                               |
|  [ Express REST API ] <---> [ JWT Auth ]      |
|  [ Socket.io Server ]                         |
+-----------------------------------------------+
```

### Detailed Component Workflow

1. **Client Initialization & State:** 
   When the user loads the application, the React frontend initializes. It uses **Zustand** to hold the global state (e.g., `authUser`, `messages`, `onlineUsers`). The app makes an initial HTTP request via **Axios** to check if a valid JWT token exists in cookies. If authenticated, the user is logged in, and a WebSocket connection is established.
   
2. **Standard REST Operations (HTTP):**
   Operations like creating an account, updating a profile picture, or fetching chat history are handled via traditional REST API endpoints in Express. 
   - If a user uploads an image, the image is sent to the Express server, which securely forwards it to **Cloudinary**.
   - Cloudinary stores the file and returns a URL.
   - The server then saves this URL into the **MongoDB** database using **Mongoose** models, keeping the database lightweight.

3. **Real-Time Communication (WebSockets):**
   The core chat functionality relies on **Socket.io**. Instead of the client constantly polling the server for new messages (which is slow and resource-intensive), Socket.io keeps a persistent connection open.

#### Real-Time Message Flow

Here is the exact sequence of events when a user sends a message:

```text
[User A (React)]        [Node.js / Socket.io]        [MongoDB]        [User B (React)]
       |                         |                       |                   |
       | 1. Emit 'sendMessage'   |                       |                   |
       |------------------------>|                       |                   |
       |                         | 2. Save message to DB |                   |
       |                         |---------------------->|                   |
       |                         |                       |                   |
       |                         | 3. Acknowledge save   |                   |
       |                         |<----------------------|                   |
       |                         |                       |                   |
       |                         | 4. Emit 'newMessage' event                |
       |                         |------------------------------------------>|
       |                         |                       |                   |
       |                         |                       |   5. Update Zustand state
       |                         |                       |   6. React UI re-renders
```

---

## 🚀 Key Features

- **Real-time Messaging:** Powered by Socket.io, enabling instant message delivery without requiring the user to refresh the page. The persistent connection ensures low latency and a smooth chatting experience.
- **Authentication & Security:** Secure user authentication using JWT (JSON Web Tokens) stored securely. Passwords are never stored in plain text; they are securely hashed using bcrypt before being saved to the database.
- **State Management:** Effortlessly managed frontend state using Zustand. This ensures that user data, chat history, and active connections are accessible across all React components without prop drilling.
- **Media Uploads:** Users can upload profile pictures and images directly within chats. This is seamlessly integrated with Cloudinary, which handles the secure storage, optimization, and fast delivery of image assets.
- **Modern UI:** Built with React 19 and styled using Tailwind CSS alongside DaisyUI components. This ensures a clean, modern, and highly customizable interface with a premium feel.
- **Responsive Design:** A fully responsive layout that adapts flawlessly. Whether accessed via a mobile phone, tablet, or desktop monitor, the chat interface remains intuitive and accessible.
- **Robust Database:** MongoDB serves as the primary NoSQL database, offering flexibility in how chat histories and user data are stored. Mongoose provides a rigorous schema-based modeling solution to enforce data integrity.

---

## 🛠️ Detailed Tech Stack

### Frontend Architecture
- **Framework - React 19 (via Vite):** Chosen for its component-based architecture and efficient rendering. Vite provides exceptionally fast hot-module replacement (HMR) and optimized production builds.
- **Styling - Tailwind CSS + DaisyUI:** Tailwind allows for rapid, utility-first styling directly in the markup. DaisyUI provides pre-built, semantic, and highly customizable UI components (like buttons, modals, and inputs) that sit on top of Tailwind.
- **State Management - Zustand:** A small, fast, and scalable bearbones state-management solution. It handles the complex global state of real-time chats much more simply than Redux.
- **Routing - React Router v7:** Handles client-side navigation, allowing users to switch between the login, registration, profile, and chat screens without full page reloads.
- **Icons - Lucide React:** A beautiful, consistent icon library used for UI elements throughout the application.
- **HTTP Client - Axios:** A promise-based HTTP client used to make predictable REST API requests to the backend for tasks like login and data fetching.
- **Real-time Client - Socket.io-client:** The frontend counterpart to the backend WebSocket server. It maintains the connection and listens for/emits events in real-time.
- **Notifications - React Hot Toast:** Provides sleek, unobtrusive popup notifications for user actions (e.g., "Logged in successfully", "Message failed to send").

### Backend Architecture
- **Runtime - Node.js:** An asynchronous, event-driven JavaScript runtime that is highly scalable and perfect for real-time applications requiring numerous concurrent connections.
- **Framework - Express.js:** A fast, unopinionated, minimalist web framework for Node.js used to build the REST API endpoints and middleware pipelines.
- **Database - MongoDB (with Mongoose):** A NoSQL document database perfect for storing flexible chat objects. Mongoose acts as the Object Data Modeling (ODM) library to enforce schemas and relationships between Users and Messages.
- **Real-time Server - Socket.io:** A library that enables low-latency, bidirectional, and event-based communication between the client and the server.
- **Authentication - JSON Web Tokens (JWT) & bcryptjs:** JWTs are issued upon successful login to verify user identity on subsequent requests. bcryptjs is a cryptographic library used to safely hash user passwords.
- **Media Storage - Cloudinary:** A cloud-based image and video management service. It offloads the heavy lifting of storing and serving media files from our Node server.
- **Environment Management - dotenv:** A zero-dependency module that loads environment variables from a `.env` file into `process.env`, keeping sensitive keys out of the source code.

---

## 📂 Project Structure

This is a monorepo setup containing both the frontend and the backend.

```
My Chat App/
├── backend/                # Node.js + Express API and Socket.io server
│   ├── src/                # Backend source code (models, routes, controllers)
│   ├── package.json        # Backend dependencies
│   └── .env                # Backend environment variables
│
└── frontend/               # React + Vite frontend application
    ├── src/                # Frontend source code (components, pages, store)
    ├── package.json        # Frontend dependencies
    ├── vite.config.js      # Vite configuration
    └── index.html          # Entry HTML
```

---

## ⚙️ Environment Variables

To run this project locally, you will need to add the following environment variables to a `.env` file inside the `backend` folder:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.../chat_db

# Server Port
PORT=5001

# JWT Secret Key
JWT_SECRET=your_jwt_secret_key

# Node Environment
NODE_ENV=development

# Cloudinary Configuration (For image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 💻 Running Locally

Follow these steps to set up the project on your local machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/my-chat-app.git
cd "My Chat App"
```

### 2. Setup the Backend
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` directory based on the variables listed above.
- Start the development server:
```bash
npm run dev
```
The backend server will run on `http://localhost:5001`.

### 3. Setup the Frontend
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```
- Start the Vite development server:
```bash
npm run dev
```
The frontend application will typically run on `http://localhost:5173`.

---

## 📜 Available Scripts

### Backend
- `npm run dev` - Starts the server using nodemon for hot-reloading during development.
- `npm start` - Starts the server using regular node (used for production).

### Frontend
- `npm run dev` - Starts the Vite development server.
- `npm run build` - Builds the React app for production into the `dist` folder.
- `npm run lint` - Runs ESLint to check for code quality issues.
- `npm run preview` - Previews the production build locally.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is open-source and available under the ISC License.
