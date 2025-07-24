import React from 'react';
import './ClickCounter.css';
import energyIcon from '../../assets/case-energy-up.svg';

function ClickCounter({ clickCount, setClickCount, maxClicks = 50 }) {
  const handleChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setClickCount(Math.min(Math.max(1, value), maxClicks));
  };

  const handleIncrement = () => {
    if (clickCount < maxClicks) {
      setClickCount(clickCount + 1);
    }
  };

  const handleDecrement = () => {
    if (clickCount > 1) {
      setClickCount(clickCount - 1);
    }
  };

  const energyCost = clickCount;
  const progressGain = clickCount * 2;

  return (
    <div className="click-counter-container">
      <div className="click-counter-label">
        Geliştirme Seviyesi
      </div>
      
      <div className="click-counter-main">
        <div className="click-counter-info">
          <div className="energy-cost">
            <img src={energyIcon} alt="energy" className="energy-icon" />
            <span>-{energyCost}</span>
          </div>
          <div className="progress-gain">
            <span>İlerleme: +{progressGain}%</span>
          </div>
        </div>
        
        <div className="click-counter-controls">
          <button 
            className="click-counter-btn" 
            onClick={handleDecrement}
            disabled={clickCount <= 1}
          >
            -
          </button>
          <input 
            type="number" 
            min="1" 
            max={maxClicks}
            value={clickCount}
            onChange={handleChange}
            className="click-counter-input"
          />
          <button 
            className="click-counter-btn" 
            onClick={handleIncrement}
            disabled={clickCount >= maxClicks}
          >
            +
          </button>
        </div>
      </div>
    </div>
      
 
  );
}

export default ClickCounter; 