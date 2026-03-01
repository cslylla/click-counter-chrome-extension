import React, { useState, useEffect } from 'react';
import './Popup.css';

const TIME_OPTIONS = [
  { value: '6h', label: 'Last 6 hours' },
  { value: '1d', label: 'Last 24 hours' },
  { value: '1w', label: 'Last 7 days' },
  { value: '1m', label: 'Last 30 days' },
];

const Popup = () => {
  const [timeRange, setTimeRange] = useState('1d');
  const [stats, setStats] = useState({ bySite: {}, byType: {}, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = () => {
    setLoading(true);
    chrome.runtime.sendMessage({ type: 'GET_STATS', timeRange }, (response) => {
      if (chrome.runtime.lastError) {
        setStats({ bySite: {}, byType: {}, total: 0 });
      } else {
        setStats(response || { bySite: {}, byType: {}, total: 0 });
      }
      setLoading(false);
    });
  };

  const clearStats = () => {
    chrome.storage.local.set({ activityEvents: [] }, () => {
      loadStats();
    });
  };

  const sortedSites = Object.entries(stats.bySite || {})
    .map(([hostname, counts]) => ({
      hostname,
      total: (counts.click || 0) + (counts.keypress || 0) + (counts.upload || 0),
      ...counts,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 15);

  const hasData = stats.total > 0;

  return (
    <div className="popup">
      <header className="popup-header">
        <h1 className="popup-title">Activity Tracker</h1>
        <p className="popup-subtitle">Clicks, typing & uploads</p>
      </header>

      <div className="filter-row">
        <label className="filter-label">Time range</label>
        <select
          className="filter-select"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          {TIME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="popup-loading">Loading...</div>
      ) : (
        <>
          <div className="stats-summary">
            <div className="stat-card total">
              <span className="stat-value">{stats.total.toLocaleString()}</span>
              <span className="stat-label">Total Activities</span>
            </div>
            <div className="stat-card sites">
              <span className="stat-value">{Object.keys(stats.bySite || {}).length}</span>
              <span className="stat-label">Sites</span>
            </div>
          </div>

          <section className="activity-breakdown">
            <h2 className="section-title">By Activity Type</h2>
            <div className="activity-cards">
              <div className="activity-card click">
                <span className="activity-value">{(stats.byType?.click || 0).toLocaleString()}</span>
                <span className="activity-label">Clicks</span>
              </div>
              <div className="activity-card keypress">
                <span className="activity-value">{(stats.byType?.keypress || 0).toLocaleString()}</span>
                <span className="activity-label">Typing</span>
              </div>
              <div className="activity-card upload">
                <span className="activity-value">{(stats.byType?.upload || 0).toLocaleString()}</span>
                <span className="activity-label">Uploads</span>
              </div>
            </div>
          </section>

          <section className="sites-section">
            <h2 className="section-title">By Site</h2>
            {sortedSites.length === 0 ? (
              <p className="empty-state">
                No activity in this time range. Browse, type, and upload files to see your stats.
              </p>
            ) : (
              <ul className="site-list">
                {sortedSites.map(({ hostname, total, click, keypress, upload }) => (
                  <li key={hostname} className="site-item">
                    <span className="site-name" title={hostname}>{hostname}</span>
                    <span className="site-total">{total.toLocaleString()}</span>
                    <div className="site-breakdown">
                      {(click || 0) > 0 && (
                        <span className="site-badge click" title="Clicks">{click}</span>
                      )}
                      {(keypress || 0) > 0 && (
                        <span className="site-badge keypress" title="Typing">{keypress}</span>
                      )}
                      {(upload || 0) > 0 && (
                        <span className="site-badge upload" title="Uploads">{upload}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {hasData && (
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
