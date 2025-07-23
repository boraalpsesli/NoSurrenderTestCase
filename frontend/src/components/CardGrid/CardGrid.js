import React from "react";
import CardItem from "../CardItem/CardItem";
import './CardGrid.css';
 

function CardGrid({ cards, onCardAction, className, action, getActionText }) {
  return (
    <div className={className ? className + ' responsive-card-grid' : 'responsive-card-grid'}>
      {cards.map(card => (
        <CardItem 
          key={card.id}  
          {...card} 
          onAction={() => onCardAction(card.id)} 
          action={getActionText ? getActionText(card) : action} 
        />
      ))}
    </div>
  );
}

export default CardGrid; 