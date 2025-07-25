import React from 'react';

function FeatureCards() {
  const features = [
    {
      emoji: '🎧',
      title: 'Supports Audio & Text',
      desc: 'Upload MP3, WAV, or TXT files for processing'
    },
    {
      emoji: '⚡',
      title: 'Fast Transcription',
      desc: 'Get transcribed content in seconds using AI'
    },
    {
      emoji: '📚',
      title: 'Summary Generation',
      desc: 'Automatically generates key takeaways from the transcript'
    }
  ];

  return (
    <section style={{ width: '90%', maxWidth: '1200px', marginTop: '30px' }}>
      <h2 style={{ marginBottom: '20px' }}>✨ Features</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        {features.map((feature, idx) => (
          <div key={idx} style={{ background: '#fff', padding: '20px', borderRadius: '10px', flex: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3>{feature.emoji} {feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureCards;
