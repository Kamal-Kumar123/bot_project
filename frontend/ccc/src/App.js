import React from 'react';
import Header from './components/Header';
import TranscriptInput from './components/TranscriptInput';
import ProcessStatus from './components/ProcessStatus';
import FeatureCards from './components/FeatureCards';
import './App.css';

function App() {
  return (
    <div className="app-container" style={{ backgroundColor: '#f4f6fb', minHeight: '100vh' }}>
      <Header />
      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <div className="top-section" style={{ display: 'flex', justifyContent: 'space-between', width: '90%', maxWidth: '1200px', marginBottom: '30px' }}>
          <TranscriptInput />
          <ProcessStatus />
        </div>
        <FeatureCards />
      </main>
    </div>
  );
}

export default App;