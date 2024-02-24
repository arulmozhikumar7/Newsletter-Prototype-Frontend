import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import parse from "html-react-parser";

const MyPublicationPage = () => {
  const [publications, setPublications] = useState([]);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user } = useUser();
  const authorId = user._id;

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await axios.get(
          `https://newsletter-prototype-backend.onrender.com/api/publications/${authorId}`
        );
        setPublications(response.data);
      } catch (error) {
        console.error("Error fetching publications:", error);
      }
    };

    fetchPublications();
  }, [authorId]);

  const handlePublicationClick = async (publicationId) => {
    try {
      const response = await axios.get(
        `https://newsletter-prototype-backend.onrender.com/api/newsletter/${publicationId}`
      );
      setSelectedPublication(response.data);
    } catch (error) {
      console.error("Error fetching newsletters:", error);
    }
  };

  const handleNewsletterTitleClick = (newsletterId) => {
    const selected = selectedPublication.find(
      (newsletter) => newsletter._id === newsletterId
    );
    setSelectedNewsletter(selected);
    setShowPopup(true);
  };

  const handleSendNewsletterToSubscribers = async (id) => {
    try {
      setSending(true);

      const selected = selectedPublication.find(
        (newsletter) => newsletter._id === id
      );
      if (!selected) {
        console.error("Selected newsletter not found");
        return;
      }

      const newsletterId = selected._id;

      await axios.post(
        `https://newsletter-prototype-backend.onrender.com/api/newsletter/send-to-subscribers/${newsletterId}`
      );
      alert("Newsletter sent to subscribers successfully!");
      setSuccess(true);
    } catch (error) {
      console.error("Error sending newsletter to subscribers:", error);
    } finally {
      setSending(false);
      setTimeout(() => {
        setSuccess(false);
        setShowPopup(false);
      }, 3000); // Hide popup after 3 seconds
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleDeletePublication = async (publicationId) => {
    // Ask for confirmation before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this publication?"
    );

    if (!confirmDelete) {
      return; // Do nothing if the user cancels
    }

    try {
      await axios.delete(
        `https://newsletter-prototype-backend.onrender.com/api/publications/${publicationId}`
      );
      // After successful deletion, update the list of publications
      const updatedPublications = publications.filter(
        (publication) => publication._id !== publicationId
      );
      setPublications(updatedPublications);
      console.log("Publication deleted successfully!");
    } catch (error) {
      console.error("Error deleting publication:", error);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-3xl font-semibold">My Publications</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {publications.map((publication) => (
          <div
            key={publication._id}
            className="relative p-6 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
            onClick={() => handlePublicationClick(publication._id)}
          >
            <h2 className="mb-2 text-xl font-semibold">{publication.name}</h2>
            <p className="text-gray-600">{publication.description}</p>
            <button
              className="absolute text-gray-600 top-2 right-2 hover:text-red-500"
              onClick={() => {
                // Prevent handlePublicationClick from triggering
                handleDeletePublication(publication._id);
              }}
            >
              {/* You can use an icon or any other UI for delete */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zM6 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
      {selectedPublication && (
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">Newsletter Titles</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedPublication.map((newsletter) => (
                <tr key={newsletter._id} className="border-b">
                  <td className="px-4 py-2 border">{newsletter.title}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="px-4 py-2 mr-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                      onClick={() => handleNewsletterTitleClick(newsletter._id)}
                    >
                      View
                    </button>
                    <button
                      className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
                      onClick={() =>
                        handleSendNewsletterToSubscribers(newsletter._id)
                      }
                      // Disable button during sending or after success
                    >
                      Send to Subscribers
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showPopup && selectedNewsletter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={handleClosePopup}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 bg-white rounded-lg shadow-lg">
              <h2 className="mb-2 text-xl font-semibold">
                {selectedNewsletter.title}
              </h2>
              <div className="text-gray-600">
                {parse(selectedNewsletter.content)}
              </div>
              <button
                className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700"
                onClick={handleClosePopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPublicationPage;
