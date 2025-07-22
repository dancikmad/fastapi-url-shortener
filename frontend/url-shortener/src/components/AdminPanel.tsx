import React, { useState } from 'react';
import { urlService, URLInfo } from '../services/api';

export const AdminPanel: React.FC = () => {
  const [secretKey, setSecretKey] = useState('');
  const [urlInfo, setUrlInfo] = useState<URLInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleGetInfo = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const info = await urlService.getURLInfo(secretKey);
      setUrlInfo(info);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch URL information');
      setUrlInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const result = await urlService.deleteURL(secretKey);
      setSuccessMessage(result.detail);
      setUrlInfo(null);
      setSecretKey('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div className="admin-search">
        <input
          type="text"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="Enter secret key from admin URL"
        />
        <button onClick={handleGetInfo} disabled={!secretKey || loading}>
          {loading ? 'Loading...' : 'Get URL Info'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {urlInfo && (
        <div className="url-info-card">
          <h3>URL Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Short URL:</label>
              <a href={urlInfo.url} target="_blank" rel="noopener noreferrer">
                {urlInfo.url}
              </a>
            </div>
            <div className="info-item">
              <label>Target URL:</label>
              <a href={urlInfo.target_url} target="_blank" rel="noopener noreferrer">
                {urlInfo.target_url}
              </a>
            </div>
            <div className="info-item">
              <label>Clicks:</label>
              <span>{urlInfo.clicks}</span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={urlInfo.is_active ? 'status-active' : 'status-inactive'}>
                {urlInfo.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <button className="delete-button" onClick={handleDelete} disabled={loading}>
            Delete URL
          </button>
        </div>
      )}
    </div>
  );
};