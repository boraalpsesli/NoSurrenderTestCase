import React from "react";
import './TabBar.css';

function TabBar({ tabs, selected, onSelect, className }) {
  return (
    <div className={`tab-bar${className ? ` ${className}` : ''}`}>
      {tabs.map((tab, idx) => (
        <button
          key={tab}
          className={`tab-bar__tab${selected === tab ? ' tab-bar__tab--active' : ''}`}
          onClick={() => onSelect(tab)}
        >
          <span className="tab-bar__label">{tab}</span>
        </button>
      ))}
    </div>
  );
}

export default TabBar; 