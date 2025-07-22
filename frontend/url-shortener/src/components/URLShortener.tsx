import React, { useState } from 'react';
import { urlService, URLInfo } from '../services/api';

export const URLShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState<URLInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShortUrl(null);

    try {
      const result = await urlService.createShortURL(url);
      setShortUrl(result);
      setUrl('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="url-shortener">
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a long URL to shorten"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>

      {shortUrl && (
        <div className="result-card">
          <h3>Your shortened URL:</h3>
          <div className="url-result">
            <div className="url-item">
              <label>Short URL:</label>
              <div className="url-display">
                <a href={shortUrl.url} target="_blank" rel="noopener noreferrer">
                  {shortUrl.url}
                </a>
                <button onClick={() => copyToClipboard(shortUrl.url)}>Copy</button>
              </div>
            </div>
            <div className="url-item">
              <label>Admin URL:</label>
              <div className="url-display">
                <span>{shortUrl.admin_url}</span>
                <button onClick={() => copyToClipboard(shortUrl.admin_url)}>Copy</button>
              </div>
              <p style={{fontSize: '0.9em', color: '#666', marginTop: '0.5rem'}}>
                Save this admin URL to manage or delete your shortened link
              </p>
            </div>
            <div className="url-stats">
              <p>Target: {shortUrl.target_url}</p>
              <p>Clicks: {shortUrl.clicks}</p>
              <p>Status: {shortUrl.is_active ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};