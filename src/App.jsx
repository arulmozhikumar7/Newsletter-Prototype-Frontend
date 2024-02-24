import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { UserProvider } from "./contexts/UserContext";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreatePublicationForm from "./pages/CreatePublicationForm";
import Navbar from "./components/Navbar";
import CreateNewsLetter from "./pages/CreateNewsLetter";
import MyPublicationPage from "./pages/MyPublicationPage";
const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/create-newsletter" element={<CreateNewsLetter />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePublicationForm />} />
          <Route path="/mypublications" element={<MyPublicationPage />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
