import React, { useState } from 'react';
import Header from './components/Header/Header';
import Chat from './components/Chat/Chat';
import DataRegistration from './components/DataRegistration/DataRegistration';

function App() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'data-registration'

  return (
    <div className="font-sans text-gray-800">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="pt-4 pb-12">
        {activeTab === 'chat' && <Chat />}
        {activeTab === 'data-registration' && <DataRegistration />}
      </main>
    </div>
  );
}

export default App;