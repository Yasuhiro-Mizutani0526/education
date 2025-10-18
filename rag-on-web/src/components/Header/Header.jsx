import PropTypes from 'prop-types';

const Header = ({ activeTab, setActiveTab }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white";
  const activeClasses = "bg-gray-900 text-white";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold tracking-tight">RAG on Web</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`${baseClasses} ${activeTab === 'chat' ? activeClasses : inactiveClasses}`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('data-registration')}
            className={`${baseClasses} ${activeTab === 'data-registration' ? activeClasses : inactiveClasses}`}
          >
            Data Registration
          </button>
        </div>
      </nav>
    </header>
  );
};

Header.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default Header;