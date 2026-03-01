import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {
  const [stats, setStats] = useState({ counts: {}, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    chrome.storage.local.get('clickCounts', (data) => {
      const counts = data.clickCounts || {};
      const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
      setStats({ counts, total });
      setLoading(false);
    });
  };

  const clearStats = () => {
    chrome.storage.local.set({ clickCounts: {} }, () => {
      loadStats();
    });
  };

  const sortedSites = Object.entries(stats.counts || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15);

  return (
    <div className="popup">
      <header className="popup-header">
        <h1 className="popup-title">Click Counter</h1>
        <p className="popup-subtitle">Your browsing activity</p>
      </header>

      {loading ? (
        <div className="popup-loading">Loading...</div>
      ) : (
        <>
          <div className="stats-summary">
            <div className="stat-card total">
              <span className="stat-value">{stats.total.toLocaleString()}</span>
              <span className="stat-label">Total Clicks</span>
            </div>
            <div className="stat-card sites">
              <span className="stat-value">{Object.keys(stats.counts || {}).length}</span>
              <span className="stat-label">Sites Tracked</span>
            </div>
          </div>

          <section className="sites-section">
            <h2 className="section-title">Clicks by Site</h2>
            {sortedSites.length === 0 ? (
              <p className="empty-state">No clicks recorded yet. Browse the web and your clicks will appear here.</p>
            ) : (
              <ul className="site-list">
                {sortedSites.map(([hostname, count]) => (
                  <li key={hostname} className="site-item">
                    <span className="site-name" title={hostname}>{hostname}</span>
                    <span className="site-count">{count.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {sortedSites.length > 0 && (
            <button className="clear-btn" onClick={clearStats}>
              Clear All Data
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Popup;
