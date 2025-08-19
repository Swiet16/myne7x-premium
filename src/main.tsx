import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import App from './App.tsx'
import CosmicLoader from './components/CosmicLoader.tsx'
import './index.css'

const AppWithLoader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <CosmicLoader isLoading={isLoading} />
      {!isLoading && <App />}
    </>
  );
};

createRoot(document.getElementById("root")!).render(<AppWithLoader />);
