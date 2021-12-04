import React from 'react';
import '../App.css';

function PokemonCard({ item }) {
  return (
    <div className="item">
        <img src={item.image} alt="" className="item-img" onClick={() => console.log("sefsdf")} />
    </div>
  );
}

export default PokemonCard;