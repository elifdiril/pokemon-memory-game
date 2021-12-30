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
import Scores from './Scores';

function GetPokemons() {
  const { loading, error, data, refetch } = useQuery(POKEMONS_QUERY);
  const [items, setItems] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [move, setMove] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStat, setGameStat] = useState(0);
  const [, setPokemons] = useState([]);
  const [allScores, setAllScores] = useState([]);

  useEffect(() => {
    //is game over or not
    if (move >= 12) {
      let openedCardNumber = 0;
      items.map((item) => {
        if (item.isOpen) {
          openedCardNumber++;
        }
      });

      if (openedCardNumber === 12) {
        let storedScores = JSON.parse(localStorage.getItem("scores")) || [];
        localStorage.setItem("scores", JSON.stringify([...storedScores, score]));
        setAllScores([...storedScores, score]);
        setGameStat(1);
      }
    }
  }, [move]);

  useEffect(() => {
    //pokemon array created
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
            newSelectedCard = updatedItem;
          }
          return updatedItem;
        }
        return item;
      });
      setSelectedCards([...selectedCards, newSelectedCard]);
      setItems(newCards);
    }
  };

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
        setTimeout(() => setItems(newCards), 450);
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
        setTimeout(() => setItems(newCards), 450);
      }
      //if two card selected, there is a control if they equal or not, either way set 
      //selected card empty arr
      setTimeout(() => setSelectedCards([]), 500);
    }
  }, [selectedCards]);

  const restart = () => {
    setScore(0);
    setMove(0);
    setGameStat(0);
    refetch();
  };

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
          <div className='res-score'>
            <Restart restart={restart} />
            <Scores allScores={allScores} />
          </div>
        </>}
      {gameStat === 0 && <div className="box">
        <div className="css-doodle">
          <div className="score-table">Score Table</div>
          <div>Movement: {move}</div>
          <div>Point: {score}</div>
        </div>

        <div className="pokemonList">
          {items && items.map((item) =>
            <PokemonCard key={item.id} item={item} turnCard={turnCard} />
          )}
        </div>
      </div>}
    </>
  );
}

export default GetPokemons;