import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { POKEMONS_QUERY } from '../queries/pokemonList';
import PokemonCard from './PokemonCard';
import '../App.css';
import shuffleArray from '../helpers/shuffleArray';
import { nanoid } from 'nanoid';
import calculateScore from '../helpers/calculateScore';

function GetPokemons() {
  const { loading, error, data } = useQuery(POKEMONS_QUERY);
  const [items, setItems] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [move, setMove] = useState(0);
  const [score, setScore] = useState(0);
  let pokemons = [];

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
        copyObj = { ...newItemList[i], isOpen: false, id: nanoid(), isMatched: false };
        newItemList[i] = copyObj;
      }

      setItems(shuffleArray(newItemList));
    }
  }, [data]);

  const turnCard = (id) => {
    setMove(move + 1);
    let newSelectedCard = {};
    if (selectedCards.length < 2) {
      const newCards = items.map((item) => {
        if (item.id === id && !item.isMatched) {
          const updatedItem = {
            ...item,
            isOpen: !item.isOpen,
          };
          if (!item.isOpen) {
            newSelectedCard = updatedItem
          }
          return updatedItem;
        }
        return item;
      });
      setSelectedCards([...selectedCards, newSelectedCard]);
      setItems(newCards);
    }
  }

  useEffect(() => {
    if (selectedCards.length === 2) {
      if (selectedCards[0].number !== selectedCards[1].number) {
        let newCards = items.map((item) => {
          if (item.id === selectedCards[0].id || item.id === selectedCards[1].id) {
            const updatedItem = {
              ...item,
              isOpen: false,
            };
            return updatedItem;
          }
          return item;
        });
        setTimeout(() => setItems(newCards), 1000);
      }
      else {
        let newCards = items.map((item) => {
          if (item.id === selectedCards[0].id || item.id === selectedCards[1].id) {

            setScore(calculateScore(move, score));

            const updatedItem = {
              ...item,
              isMatched: true,
            };
            return updatedItem;
          }
          return item;
        });
        setTimeout(() => setItems(newCards), 1000);
      }
      setTimeout(() => setSelectedCards([]), 1010);
    }
  }, [selectedCards]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="box">
      <div className="pokemonList">
        {items && items.map((item) =>
          <PokemonCard key={item.id} item={item} turnCard={turnCard} />
        )}
      </div>
      <div class="css-doodle">
        <div className="score-table">Score Table</div>
        <div>Movement: {move}</div>
        <div>Point: {score}</div>
      </div>
    </div>
  );
}

export default GetPokemons;