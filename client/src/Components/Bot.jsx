import React, { useState } from 'react';

export const Bot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { text: input, isUser: true }]);
      
      const response = await fetch('http://localhost:3001/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          touristSpots: [
            {
              placeName: "Cox's Bazar",
              description: "Longest natural sea beach in the world.",
              timeToTravel: "November to February",
              ticketPricing: "Free",
              placeDetails: "Beach, Sea, Sunset",
              hotels: [
                {
                  hotelName: "Hotel Sea Crown",
                  price: "5000-10000",
                  description: "A luxurious hotel with sea view."
                },
                {
                  hotelName: "Hotel Sunshine",
                  price: "2000-5000",
                  description: "A budget-friendly hotel near the beach."
                }
              ]
            },
            // Add more tourist spots as needed
          ]
        }),
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
      setInput('');
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        overflowY: "auto",
        maxHeight: "90vh",
        marginTop: "80px",
      }}>
      <div style={{ marginBottom: "10px" }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: message.isUser ? "#007bff" : "#f1f1f1",
              color: message.isUser ? "#fff" : "#000",
              marginBottom: "5px",
              maxWidth: "80%",
              alignSelf: message.isUser ? "flex-end" : "flex-start",
            }}
          >
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div style={{ fontStyle: "italic", color: "#666" }}>Thinking...</div>
        )}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          placeholder="Ask me about tourist spots..."
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Bot;