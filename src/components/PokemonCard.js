import React from 'react';
import '../App.css';

function PokemonCard({ item, turnCard }) {
  
  return (
    <div className="item">
        <img src={item.image} alt="" className="item-img" onClick={() => turnCard(item.number)} />
    </div>
  );
}

export default PokemonCard;