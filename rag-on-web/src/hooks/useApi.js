import { useState } from 'react';

// Dummy Webhook URLs
const N8N_WEBHOOK_URL_CHAT = 'https://dummy.n8n.url/webhook/chat';
const N8N_WEBHOOK_URL_DATA_REGISTRATION = 'https://dummy.n8n.url/webhook/data-registration';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = async (endpoint, data) => {
    setIsLoading(true);
    setError(null);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // This is a mock response. In a real scenario, you'd use fetch().
      // We will simulate different scenarios based on the input.

      if (data instanceof FormData && data.get('file')) {
        const file = data.get('file');
        if (file.name.includes('fail')) {
          throw new Error('File upload failed');
        }
        return { success: true, message: 'File uploaded successfully.' };
      }

      if (data.url && data.url.includes('fail')) {
        throw new Error('URL registration failed');
      }

      if (data.message && data.message.toLowerCase().includes('fail')) {
          throw new Error('AI is not responding');
      }

      if ( (data.message && data.message.toLowerCase().includes('network error')) ||
           (data.url && data.url.includes('network error')) ) {
        throw new Error('Could not connect to the server. Please check if n8n is running.');
      }

      if (endpoint === 'chat') {
        return { answer: `This is a mocked AI response for your question: "${data.message}"` };
      }

      return { success: true, message: 'Data registered successfully.' };

    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { post, isLoading, error, setError };
};