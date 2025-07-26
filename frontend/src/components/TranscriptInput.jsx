import React, { useState } from 'react';
import axios from 'axios';


const BASE_URL="https://fastapi-backend-vpxy.onrender.com"
function TranscriptInput() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadAndTranscribe = async () => {
    if (!file) {
      alert('Please select a file!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setStatus('Uploading & Processing...');

    try {
      const response = await axios.post(`${BASE_URL}/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setTranscript(response.data.transcript || '');
      setSummary(response.data.summary || '');
      setStatus('✅ Done!');
    } catch (error) {
      console.error('Error:', error);
      setStatus('❌ Failed to process file.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setTranscript('');
    setSummary('');
    setStatus('');
  };

  return (
    <div className="transcript-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '45%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h3>📄 Upload File</h3>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Transcript Processor</h3>
      <input
        type="file"
        accept=".mp3,.wav,.m4a,.aac,.ogg,.txt"
        onChange={handleFileChange}
        aria-label="Choose file"
        data-testid="file-input"
      />
      <button onClick={handleUploadAndTranscribe} disabled={loading} style={{ marginLeft: '10px', padding: '6px 12px' }}>
        {loading ? 'Processing...' : 'Upload & Transcribe'}
      </button>

      {transcript && (
        <>
          <h4 style={{ marginTop: '20px' }}>📝 Transcript</h4>
          <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} style={{ width: '100%', height: '150px', marginTop: '10px', padding: '10px' }} />
        </>
      )}
      
      {summary && (
  <>
    <h4 style={{ marginTop: '20px' }}>📚 Summary</h4>
    {Array.isArray(summary) ? (
      summary.map((item, index) => (
        <div key={index} style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
          <p><strong>🧠 Headline:</strong> {item.headline}</p>
          <p><strong>📝 Summary:</strong> {item.summary}</p>
          <p><strong>📌 Gist:</strong> {item.gist}</p>
          <p><strong>⏱️ Time:</strong> {item.start} - {item.end}</p>
        </div>
      ))
    ) : (
      <p style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>{summary}</p>
    )}
  </>
)}
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <button onClick={handleClear} style={{ background: '#f8d7da', padding: '8px 12px', borderRadius: '5px' }}>Clear</button>
      </div>
      <p style={{ marginTop: '10px', color: '#7f8c8d' }}>{status}</p>
    </div>
  );
}

export default TranscriptInput;