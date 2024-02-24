import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useUser } from "../contexts/UserContext";

const CreateNewsLetter = () => {
  const [value, setValue] = useState("");
  const [publications, setPublications] = useState([]);
  const { user } = useUser();
  const authorId = user._id;
  const [publicationId, setPublicationId] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchPublicationNames = async () => {
      try {
        const response = await axios.get(
          `https://newsletter-prototype-backend.onrender.com/api/publications/${authorId}`
        );

        setPublications(response.data);
      } catch (error) {
        console.error("Error fetching publication names:", error);
      }
    };

    fetchPublicationNames();
  }, [user, authorId]);

  const handlePublish = async () => {
    try {
      await axios.post(
        `https://newsletter-prototype-backend.onrender.com/api/newsletter/${publicationId}`,
        {
          title: title,
          content: value,
        }
      );

      setValue("");
      setTitle("");
      setPublicationId("");

      alert("Newsletter published successfully!");
    } catch (error) {
      console.error("Error publishing newsletter:", error);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">
        Create New Newsletter
      </h1>

      <div className="flex flex-col justify-center space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="md:w-1/2">
          <label htmlFor="publication" className="text-xl">
            Select Publication
          </label>
          <select
            id="publication"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={publicationId}
            onChange={(e) => setPublicationId(e.target.value)}
          >
            <option value="">Select a publication</option>
            {publications.map((publication) => (
              <option key={publication._id} value={publication._id}>
                {publication.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:w-1/2">
          <label htmlFor="title" className="text-xl">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8">
        <label className="text-xl">Content</label>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          placeholder="Start writing here..."
          className="w-full mt-2 border border-gray-300 rounded-md h-96 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={handlePublish}
          className="px-6 py-3 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default CreateNewsLetter;
