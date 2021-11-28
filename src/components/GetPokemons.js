import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { POKEMONS_QUERY } from '../queries/pokemonList';
import PokemonCard from './PokemonCard';
import '../App.css';

function GetPokemons() {
  const { loading, error, pokemons } = useQuery(POKEMONS_QUERY);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (pokemons)
      for (let i = 0; i < 6; i++) {
        let randomPokemonId = Math.floor(Math.random() * pokemons.length);
        if (pokemons[randomPokemonId]) {
          setItems(...items, pokemons[randomPokemonId]);
          pokemons = pokemons.filter(item => item.id !== randomPokemonId);
        }
      };
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Pokemons</h1>
      <div className="pokemonList">
        {items && items.map((item) => (
          <PokemonCard item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}

export default GetPokemons;