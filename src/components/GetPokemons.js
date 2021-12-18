import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { POKEMONS_QUERY } from '../queries/pokemonList';
import PokemonCard from './PokemonCard';
import '../App.css';
import shuffleArray from '../helpers/shuffleArray';
import { nanoid } from 'nanoid';
import calculateScore from '../helpers/calculateScore';
import Winning from './Winning';
import Restart from './Restart';

function GetPokemons() {
  const { loading, error, data, refetch } = useQuery(POKEMONS_QUERY);
  const [items, setItems] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [move, setMove] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStat, setGameStat] = useState(0);
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    if (move >= 12) {
      let openedCardNumber = 0;
      items.map((item) => {
        if (item.isOpen) {
          openedCardNumber++;
        }
      })

      if (openedCardNumber === 12) {
        setGameStat(1);
      }
    }
  }, [move]);

  useEffect(() => {
    if (data) {
      let _pokemons = data.pokemons;
      setPokemons(data.pokemons);
      let newItemList = [];
      for (let i = 0; i < 6; i++) {
        let randomPokemonId = Math.floor(Math.random() * _pokemons.length);
        if (_pokemons[randomPokemonId]) {
          newItemList.push(_pokemons[randomPokemonId]);
          newItemList.push(_pokemons[randomPokemonId]);
          _pokemons = _pokemons.filter(item => item.id !== randomPokemonId);
          setPokemons(_pokemons);
        }
      }

      let copyObj = {};
      for (let i = 0; i < newItemList.length; i++) {
        copyObj = { ...newItemList[i], isOpen: false, id: nanoid(), isMatched: false };
        newItemList[i] = copyObj;
      }

      setItems(shuffleArray(newItemList));
    }
  }, [data, gameStat]);

  const turnCard = (id) => {
    let newSelectedCard = {};
    if (selectedCards.length < 2) {
      const newCards = items.map((item) => {
        if (item.id === id && !item.isMatched) {
          const updatedItem = {
            ...item,
            isOpen: !item.isOpen,
          };

          //open card then increase the number of move
          setMove(move + 1);

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
        setTimeout(() => setItems(newCards), 500);
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
        setTimeout(() => setItems(newCards), 500);
      }
      setTimeout(() => setSelectedCards([]), 510);
    }
  }, [selectedCards]);

  const restart = () => {
    setGameStat(0);
    refetch();
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {gameStat === 1 &&
        <>
          <Winning />
          <Restart restart={restart} />
        </>}
      {gameStat === 0 && <div className="box">
        <div className="pokemonList">
          {items && items.map((item) =>
            <PokemonCard key={item.id} item={item} turnCard={turnCard} />
          )}
        </div>
        <div className="css-doodle">
          <div className="score-table">Score Table</div>
          <div>Movement: {move}</div>
          <div>Point: {score}</div>
        </div>
      </div>}
    </>
  );
}

export default GetPokemons;