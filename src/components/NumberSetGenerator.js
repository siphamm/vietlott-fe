import React, { useState } from 'react';
import shuffle from '../lib/shuffleArray';

import './NumberSetGenerator.css';

export default function NumberSetGenerator() {
  const [seedNumberSet, setSeedNumberSet] = useState([]);
  const [isUnique, setIsUnique] = useState(false);
  const [numberSetCount, setNumberSetCount] = useState(100);
  const [numberSetLength, setNumberSetLength] = useState(6);
  const [generatedSets, setGeneratedSets] = useState([]);

  function onSeedInputChange(evt) {
    const val = (evt.target.value || '').replace(/\s+/g, ' ').trim();
    const numberSet = new Set(val.split(' '));
    setSeedNumberSet([...numberSet]);
  }

  function onGenerateClick() {
    if (isUnique) {
      const shuffledSeed = shuffle(seedNumberSet);
      const res = [];

      while (shuffledSeed.length >= numberSetLength) {
        res.push(shuffledSeed.splice(0, numberSetLength).sort());
      }
      setGeneratedSets(numberSetCount ? res.slice(0, numberSetCount) : res);
    } else {
      const res = [];

      for (let i = 0; i < numberSetCount; i++) {
        const shuffledSeed = shuffle(seedNumberSet);
        const generatedArr = [];

        for (let j = 0; j < numberSetLength; j++) {
          const randomIdx = Math.floor(
            Math.random() * (shuffledSeed.length - 1)
          );
          generatedArr.push(shuffledSeed.splice(randomIdx, 1));
        }

        res.push(generatedArr.sort());
      }

      setGeneratedSets(res);
    }
  }

  return (
    <div className='numberSetGenerator'>
      <h1>Chọn bộ số</h1>
      <div>
        <h4>Bộ số</h4>
        <input
          className='seedInput'
          defaultValue={''}
          onChange={onSeedInputChange}
        />
        <h4>Quantity</h4>
        <input
          type='number'
          defaultValue={numberSetCount || ''}
          placeholder='Quantity'
          min='1'
          onChange={(evt) => {
            setNumberSetCount(parseInt((evt.target.value || '').trim(), 10));
          }}
        />
        <h4>X</h4>
        <input
          type='number'
          defaultValue={numberSetLength || ''}
          placeholder='X'
          min='1'
          onChange={(evt) => {
            setNumberSetLength(parseInt((evt.target.value || '').trim(), 10));
          }}
        />
        <div>
          <input
            type='checkbox'
            id='isUniqueCb'
            className='isUniqueCb'
            defaultChecked={isUnique}
            onChange={() => {
              setIsUnique(!isUnique);
            }}
          />{' '}
          <label htmlFor='isUniqueCb'>
            <strong>Unique</strong>
          </label>
        </div>
        <button onClick={onGenerateClick}>Generate</button>
      </div>
      {generatedSets.length > 0 && (
        <div className='generatedNumberSets'>
          {generatedSets.map((set, idx) => {
            return (
              <div className='generatedNumberSet' key={idx}>
                <code>{set.join(' ')}</code>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
