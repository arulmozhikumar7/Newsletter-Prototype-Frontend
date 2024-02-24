import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const PublicationsPage = () => {
  const { user } = useUser();
  const [publications, setPublications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [paymentInit, setPaymentInit] = useState(false);
  useEffect(() => {
    const fetchPublications = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://newsletter-prototype-backend.onrender.com/api/publications"
        );
        setPublications(response.data);
        console.log(user);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, [paymentInit]);

  const handleSubscribe = async (publicationId, Author) => {
    // Check if user is logged in
    if (!user) {
      setError("Please login to subscribe");
      alert("Please login to subscribe");
      navigate("/");
      return;
    }
    if (Author == user) {
      setError("You cannot subscribe to your own publication");
      alert("You cannot subscribe to your own publication");
      return;
    }
    try {
      // Send a request to your backend to initiate subscription
      const response = await axios.post(
        "https://newsletter-prototype-backend.onrender.com/api/subscribe",
        {
          publicationId,
          userId: user,
        }
      );
      const { orderId, amount } = response.data;
      // Open Razorpay payment page
      const options = {
        key: "rzp_test_1RKKP5rJBqKpT4", // Replace with your Razorpay key
        amount: amount,
        currency: "INR",
        name: "Publication Subscription",
        description: "Subscription for Publication",
        order_id: orderId,
        handler: async function (response) {
          try {
            const paymentId = response.razorpay_payment_id;
            // Send a request to confirm payment
            const confirmResponse = await axios.post(
              "https://newsletter-prototype-backend.onrender.com/api/payment/confirm",
              {
                paymentId,
                publicationId,
                userId: user,
              }
            );
            if (confirmResponse.data.success) {
              alert("Subscription successful");
              setPaymentInit(true);
              console.log("Payment successful");
              // Optionally, update state or show success message
            } else {
              console.log("Payment failed");
              // Optionally, show error message
            }
          } catch (error) {
            console.error("Error confirming payment:", error.message);
            // Optionally, show error message
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        notes: {
          publicationId: publicationId,
        },
        theme: {
          color: "#F37254",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error subscribing:", error.message);
      // Optionally, show error message
    }
  };

  if (loading) {
    return (
      <div class="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section class="text-gray-600 body-font">
      <div class="container px-5 py-24 mx-auto">
        <div class="flex flex-wrap -m-4">
          {publications.map((publication) => (
            <div class="p-4 lg:w-1/3" key={publication._id}>
              <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                <h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                  Publication
                </h2>
                <h1 class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
                  {publication.name}
                </h1>
                <p class="leading-relaxed mb-3">
                  Author: {publication.author.username}
                </p>
                <button
                  onClick={() => handleSubscribe(publication._id)}
                  class="text-indigo-500 inline-flex items-center"
                >
                  Subscribe
                </button>
                <div class="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-person-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />{" "}
                  </svg>
                  {publication.subscribers.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublicationsPage;
