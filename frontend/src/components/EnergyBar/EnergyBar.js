import React from "react";
import './EnergyBar.css';
import energyImg from '../../assets/Header/case-energy 1.svg';

function EnergyBar({ percent, timeLeft, className }) {
  return (
    <div className={className ? className + ' energy-bar-container' : 'energy-bar-container'}>
        <img src={energyImg} alt="Energy" className="energy-bar-img" />
        
        <div className="energy-bar-top-row">
          <span className="energy-bar-title">Enerji</span>
          <span className="energy-bar-timer">%1 Yenilenmesine Kalan: {timeLeft}</span>
        </div>
        
        <div className="energy-bar-progress-bg">
          <div className="energy-bar-progress-fill" style={{ width: `${percent}%` }}></div>
          <span className="energy-bar-percentage">{percent.toFixed(0)}%</span>
        </div>
    </div>
  );
}

export default EnergyBar; 