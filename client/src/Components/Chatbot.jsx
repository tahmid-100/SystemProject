import React, { useState } from 'react';
import axios from 'axios';

export const Chatbot = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleQuery = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/chatbot', { query });
      if (res.data.success) {
        setResponse(JSON.stringify(res.data.data, null, 2));
      } else {
        setResponse(res.data.message);
      }
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
    }
  };

  return (
    <div>
      <h2>Tourism Chatbot</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about a place..."
      />
      <button onClick={handleQuery}>Send</button>
      <div>
        <h3>Response:</h3>
        <pre>{response}</pre>
      </div>
    </div>
  );
};

