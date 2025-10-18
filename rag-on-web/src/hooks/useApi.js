import { useState } from 'react';

// Actual n8n Webhook URLs provided by the user
const N8N_WEBHOOK_URL_CHAT = 'http://localhost:5678/webhook-test/d10ce9ba-e535-40a7-aad6-14a922b24ef9';
const N8N_WEBHOOK_URL_DATA_REGISTRATION = 'http://localhost:5678/webhook-test/a8d81fee-2bd6-4f11-89fc-8118ed761a5a';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = async (endpoint, data) => {
    setIsLoading(true);
    setError(null);

    const url = endpoint === 'chat' ? N8N_WEBHOOK_URL_CHAT : N8N_WEBHOOK_URL_DATA_REGISTRATION;

    try {
      const options = {
        method: 'POST',
      };

      if (data instanceof FormData) {
        // For file uploads, let the browser set the Content-Type header
        options.body = data;
      } else {
        // For JSON data (chat, URL registration)
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
        } catch {
            // The response was not JSON, use the raw text if it's not too long
            errorMessage = errorText.length < 200 ? errorText : errorMessage;
        }
        throw new Error(errorMessage);
      }

      // n8n can sometimes return an empty body with a 200 OK status for webhooks.
      // We need to handle this case gracefully.
      const responseText = await response.text();
      if (!responseText) {
          return { success: true, message: 'Request received by n8n.' };
      }

      const result = JSON.parse(responseText);
      return result;

    } catch (err) {
      console.error('Fetch error:', err);
      // More user-friendly network error message
      if (err instanceof TypeError) { // This often indicates a network failure
          setError('Failed to connect to the server. Please ensure n8n is running and accessible.');
      } else {
          setError(err.message || 'An unknown error occurred.');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { post, isLoading, error, setError };
};