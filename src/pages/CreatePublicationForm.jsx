import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const CreatePublicationForm = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    author: user, // Assuming you have a way to get the author ID
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (!user) {
      setError("Please login to create a publication");
      alert("Please login to create a publication");
      navigate("/Login");
      return;
    }
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(
        "https://newsletter-prototype-backend.onrender.com/api/publications",
        formData
      );
      console.log(response);
      navigate("/mypublications");
      setSuccessMessage("Publication created successfully");
      setFormData({ name: "", author: "", description: "" });
    } catch (error) {
      setError("Failed to create publication");
    }
  };

  return (
    <div className="max-w-lg p-6 mx-auto mt-8 bg-white rounded-lg shadow-xl">
      <h2 className="mb-4 text-2xl font-bold">Start Your Own Publication</h2>

      {error && <div className="mb-4 text-red-500">{error}</div>}
      {successMessage && (
        <div className="mb-4 text-green-500">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Publication Title:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-md"
        >
          Create Publication
        </button>
      </form>
    </div>
  );
};

export default CreatePublicationForm;
