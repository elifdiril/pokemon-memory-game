const calculateScore = (move, score) =>{
    if (move < 13) {
        return (score + 100);
      }
      else if (move < 90) {
        return (score + 100 - move);
      }
      else {
        return (score + 10);
      }
}

export default calculateScore;