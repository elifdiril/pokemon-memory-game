import React from 'react';
import '../App.css';

function PokemonCard({ item }) {
  return (
    <div className="item">
        <img src={item.image} alt="" className="item-img" />
    </div>
  );
}

export default PokemonCard;