// Add this temporary component to your admin chat page to debug
import React, { useContext } from 'react';
import { AuthContext } from '../Context/authcontext';

const TokenDebugger = () => {
  const { token } = useContext(AuthContext);
  
  const testTokenSend = async () => {
    const currentToken = token || localStorage.getItem("token");
    
    console.log("=== TOKEN DEBUG ===");
    console.log("1. Token from context:", token);
    console.log("2. Token from localStorage:", localStorage.getItem("token"));
    console.log("3. Current token being used:", currentToken);
    
    // Test direct fetch
    try {
      const response = await fetch('http://localhost:5000/api/message/getusers', {
        method: 'GET',
        headers: {
          'token': currentToken,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("4. Response status:", response.status);
      const data = await response.json();
      console.log("5. Response data:", data);
    } catch (error) {
      console.error("6. Fetch error:", error);
    }
  };
  
  return (
    <div style={{ padding: '20px', border: '2px solid red', margin: '10px' }}>
      <h3>Token Debugger</h3>
      <button onClick={testTokenSend}>Test Token Send</button>
      <div>
        <p>Token from context: {token ? 'EXISTS' : 'NULL'}</p>
        <p>Token from localStorage: {localStorage.getItem("token") ? 'EXISTS' : 'NULL'}</p>
      </div>
    </div>
  );
};

export default TokenDebugger;