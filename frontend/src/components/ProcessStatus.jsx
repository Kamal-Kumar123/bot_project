import React from 'react';

function ProcessStatus() {
  return (
    <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', width: '45%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h3>🛠️ How It Works</h3>
      <ol style={{ lineHeight: '1.6' }}>
        <li>Select an audio or .txt file</li>
        <li>Click <strong>"Upload & Transcribe"</strong></li>
        <li>Wait for the AI to generate transcript & summary</li>
        <li>Review, edit, or clear the result</li>
      </ol>
    </div>
  );
}

export default ProcessStatus;
