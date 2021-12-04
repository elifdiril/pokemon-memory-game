import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { POKEMONS_QUERY } from '../queries/pokemonList';
import PokemonCard from './PokemonCard';
import '../App.css';

function GetPokemons() {
  const { loading, error, data } = useQuery(POKEMONS_QUERY);
  const [items, setItems] = useState([]);
  let pokemons = [];

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  useEffect(() => {
    if (data) {
      pokemons = data.pokemons;
      let newItemList = [];
      for (let i = 0; i < 6; i++) {
        let randomPokemonId = Math.floor(Math.random() * pokemons.length);
        if (pokemons[randomPokemonId]) {
          newItemList.push(pokemons[randomPokemonId]);
          newItemList.push(pokemons[randomPokemonId]);
          pokemons = pokemons.filter(item => item.id !== randomPokemonId);
        }
      }

      let copyObj = {};
      for (let i = 0; i < newItemList.length; i++) {
        copyObj = {...newItemList[i], isOpen: false };
        newItemList[i] = copyObj;
      }

      setItems(shuffleArray(newItemList));
      console.log(newItemList)
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="pokemonList">
      {items && items.map((item) =>
        <PokemonCard key={item.id} item={item} />
      )}
    </div>
  );
}

export default GetPokemons;