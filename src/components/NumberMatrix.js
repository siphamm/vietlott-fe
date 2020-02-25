import React, {useContext, useState, useRef} from 'react';
import AppContext from '../data/app-context';
import './NumberMatrix.css';

export default function NumberMatrix() {
  const {state} = useContext(AppContext);
  const [seedNumberSet, setSeedNumberSet] = useState(null);
  const seedNumberSetRef = useRef(null);
  const {
    analytics: {
      markov: {score}
    }
  } = state;

  const numbers = Object.keys(score).sort();
  const filteredNumbers = seedNumberSet
    ? numbers.filter(num => seedNumberSet.has(num))
    : numbers;

  const headers = filteredNumbers.map(num => {
    return (
      <td>
        <strong>{num}</strong>
      </td>
    );
  });

  function onSetSeedNumberSetClick(evt) {
    evt.preventDefault();
    const seedNumberSetVal = (seedNumberSetRef.current.value || '').trim();
    if (!seedNumberSetVal) {
      setSeedNumberSet(null);
    } else {
      setSeedNumberSet(new Set(seedNumberSetVal.split(' ')));
    }
  }

  return (
    <div className="numberMatrix">
      <form onSubmit={onSetSeedNumberSetClick}>
        <input
          placeholder="Bộ số muốn chọn"
          type="text"
          ref={seedNumberSetRef}
        />
        <button onClick={onSetSeedNumberSetClick}>Set</button>
      </form>
      <br />
      <table className="numberMatrixTable mono">
        <thead>
          <tr>
            <td>&nbsp;</td>
            {headers}
          </tr>
        </thead>
        <tbody>
          {filteredNumbers.map(number => {
            const numberScores = score[number];
            return (
              <tr>
                <td>
                  <strong>{number}</strong>
                </td>
                {filteredNumbers.map(option => {
                  if (option === number) {
                    return <td>&nbsp;</td>;
                  }

                  return (
                    <td>{((numberScores[option] || 0) * 100).toFixed(0)}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
