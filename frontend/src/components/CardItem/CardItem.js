import React from "react";
import './CardItem.css';
import levelUpIcon from '../../assets/case-energy-up.svg';
function CardItem({ image, level, name, description, progress, action, onAction, className }) {
  const isLevelingUp = progress >= 100;
  
  return (
    <div className={className ? className + ' card-absolute-root' : 'card-absolute-root'}>
      
      <img src={image} alt={name} className="card-rect-image" />
      
      <div className="card-level">Seviye {level}</div>

      <div>
        <div className="card-info">
          <div className="card-title">{name}</div>
          <div className="card-desc">{description}</div>
        </div>

        <div className="card-actions">
          <div className="card-progress-bg">
            <div className="card-progress-fill" style={{ width: `${progress}%` }} />
            <span className="card-progress-label">%{progress}</span>
          </div>
          
          {isLevelingUp ? (
            <button className="card-level-up-btn" onClick={onAction}> 
              <img src={levelUpIcon} alt="level-up" className="card-level-up-btn-icon" />
              <span className="card-level-up-btn-icon-text">-1</span>
              <span className="card-level-up-btn-text">{action}</span>         
            </button>
          ) : (
            <button className="card-action-btn" onClick={onAction}>
              {action}
            </button>
          )}
        </div>
    </div>
    </div>
  );
}

export default CardItem; 