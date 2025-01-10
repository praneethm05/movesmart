import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import './TrafficInsights.css';

// InsightItem Component
const InsightItem = ({ insight, onVote, votes }) => {
  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return '#EF4444'; // Red
    if (percentage >= 70) return '#F59E0B'; // Orange
    return '#22C55E'; // Green
  };

  const getVoteCount = (type) => {
    if (type === 'up') {
      return insight.votes + (votes[insight.id] === 'up' ? 1 : 0);
    }
    return Math.max(
      0,
      insight.votes - (votes[insight.id] === 'down' ? Math.ceil(insight.votes * 0.1) : 0)
    );
  };

  return (
    <div className="insight-item">
      <div className="insight-content">
        <div className="insight-main">
          <h3>{insight.location}</h3>
          <p className="issue-type">{insight.issue}</p>
          <p className="report-time">{insight.reportedTime}</p>
        </div>
        
        <div className="insight-percentage">
          <span style={{ color: getPercentageColor(insight.percentage) }}>
            {insight.percentage}%
          </span>
        </div>
      </div>

      <div className="voting-section">
        <button 
          className={`vote-button ${votes[insight.id] === 'up' ? 'active' : ''}`}
          onClick={() => onVote(insight.id, 'up')}
        >
          <ThumbsUp size={16} />
          <span>{getVoteCount('up')}</span>
        </button>
        
        <button 
          className={`vote-button ${votes[insight.id] === 'down' ? 'active' : ''}`}
          onClick={() => onVote(insight.id, 'down')}
        >
          <ThumbsDown size={16} />
          <span>{getVoteCount('down')}</span>
        </button>
      </div>
    </div>
  );
};

export const TrafficInsights = () => {
  const [insights] = useState([
    {
      id: 1,
      location: "Hampankatta Junction",
      issue: "Road Works",
      percentage: 85,
      votes: 34,
      reportedTime: "2 hours ago",
      isUpvoted: false,
      isDownvoted: false
    },
    {
      id: 2,
      location: "State Bank Road",
      issue: "Heavy Traffic",
      percentage: 100,
      votes: 56,
      reportedTime: "30 mins ago",
      isUpvoted: false,
      isDownvoted: false
    },
    {
      id: 3,
      location: "PVS Circle",
      issue: "Accident Reported",
      percentage: 75,
      votes: 28,
      reportedTime: "15 mins ago",
      isUpvoted: false,
      isDownvoted: false
    }
  ]);

  const [votes, setVotes] = useState({});
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleVote = (insightId, voteType) => {
    setVotes(prev => {
      if (prev[insightId] === voteType) {
        const newVotes = { ...prev };
        delete newVotes[insightId];
        return newVotes;
      }
      return {
        ...prev,
        [insightId]: voteType
      };
    });
  };

  return (
    <div className="insights-card">
      <div className="insights-header">
        <h2>Insights on Traffic in your region</h2>
        <button 
          className="report-button"
          onClick={() => setIsReportModalOpen(true)}
        >
          <AlertCircle size={16} />
          Report Issue
        </button>
      </div>

      <div className="insights-list">
        {insights.map((insight) => (
          <InsightItem 
            key={insight.id}
            insight={insight}
            votes={votes}
            onVote={handleVote}
          />
        ))}
      </div>

      {isReportModalOpen && (
        <ReportIssueModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
};

const ReportIssueModal = ({ isOpen, onClose }) => {
  const [report, setReport] = useState({
    location: '',
    issueType: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle report submission here
    console.log('Report submitted:', report);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="report-modal">
        <h3>Report Traffic Issue</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={report.location}
              onChange={(e) => setReport({...report, location: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Issue Type</label>
            <select
              value={report.issueType}
              onChange={(e) => setReport({...report, issueType: e.target.value})}
              required
            >
              <option value="">Select issue type</option>
              <option value="accident">Accident</option>
              <option value="roadwork">Road Work</option>
              <option value="heavyTraffic">Heavy Traffic</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Describe the issue"
              value={report.description}
              onChange={(e) => setReport({...report, description: e.target.value})}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Submit Report</button>
          </div>
        </form>
      </div>
    </div>
  );
}; 