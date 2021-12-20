import React from 'react';
import '../styles/scores.css';

function Scores({allScores}) {
    return (
        <div className="css-doodle">
          <div className="score-table">Scores</div>
          {allScores.map((item, key) => <div key={key}>Point: {item}</div>)}
        </div>
    );
}

export default Scores;