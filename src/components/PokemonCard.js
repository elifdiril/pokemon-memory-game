import React from 'react';
import '../App.css';
import pokeball from '../assests/pokeball.png';

function PokemonCard({ item, turnCard }) {

  return (
    <div className="item">
      {!item.isOpen && <img src={pokeball} alt="" className="item-img" onClick={() => turnCard(item.id)} />}
      {item.isOpen && <img src={item.image} alt="" className="item-img" onClick={() => turnCard(item.id)} />}
    </div>
  );
}

export default PokemonCard;