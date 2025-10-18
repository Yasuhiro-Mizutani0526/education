import { useState } from 'react';
import { useApi } from '../../hooks/useApi';

const DataRegistration = () => {
  const [activeSubTab, setActiveSubTab] = useState('file'); // 'file' or 'url'
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  const { post, isLoading, error, setError } = useApi();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setNotification({ message: '', type: '' });
    setError(null);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setNotification({ message: '', type: '' });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: '', type: '' });
    setError(null);

    let response = null;
    if (activeSubTab === 'file' && file) {
      const formData = new FormData();
      formData.append('file', file);
      response = await post('data-registration', formData);
    } else if (activeSubTab === 'url' && url) {
      response = await post('data-registration', { url });
    }

    if (response) {
      setNotification({ message: response.message || 'Successfully registered!', type: 'success' });
      setFile(null);
      setUrl('');
      if (e.target.elements['file-upload']) {
        e.target.elements['file-upload'].value = '';
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Data Registration</h2>

        {/* Notification Area */}
        {notification.message && (
          <div className={`p-3 mb-4 rounded-lg text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
            {notification.message}
          </div>
        )}
        {error && (
            <div className="p-3 mb-4 rounded-lg bg-red-100 text-red-900 text-sm">
                {error}
            </div>
        )}

        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveSubTab('file')}
            className={`py-2 px-4 font-semibold text-sm transition-colors duration-200 ${activeSubTab === 'file' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveSubTab('url')}
            className={`py-2 px-4 font-semibold text-sm transition-colors duration-200 ${activeSubTab === 'url' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Register URL
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeSubTab === 'file' && (
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Select Word or PDF file
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".doc,.docx,.pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

            </div>
          )}

          {activeSubTab === 'url' && (
            <div>
              <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Web Page URL
              </label>
              <input
                id="url-input"
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://example.com"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={ isLoading || ((activeSubTab === 'file' && !file) || (activeSubTab === 'url' && !url)) }
            >
              {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
              {isLoading ? 'Registering...' : 'Register Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataRegistration;