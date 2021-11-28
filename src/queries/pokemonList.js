import { gql } from '@apollo/client';

export const POKEMONS_QUERY = gql`
  query Pokemons {
    pokemons(first: 150) {
      number
      image
    }
  }
`;