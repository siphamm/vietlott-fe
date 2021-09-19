import React, { useContext, useRef, useState } from 'react';
import AppContext from '../data/app-context';
import classnames from 'classnames';
import './CustomNumberSet.css';

/** Thong ke theo so lan trung */
function calculateCustomNumberSetStats({
  nValues = [],
  numberSet = new Set(),
  dateOverall = {},
  onlyCountWinnings = false,
}) {
  const results = {};
  const dates = Object.keys(dateOverall);

  nValues.forEach((numMaxTimesLookback) => {
    const appearances = {};

    // Set count for each number in the numberSet to 0
    [...numberSet].forEach((num) => {
      appearances[num] = 0;
    });

    let numTimesLookbackSoFar = 0;

    for (
      let i = 0, len = dates.length;
      i < len && numTimesLookbackSoFar < numMaxTimesLookback;
      i++
    ) {
      const drawingDate = dates[i];
      const { drawingResult } = dateOverall[drawingDate];
      const matches = drawingResult.filter((num) => {
        return numberSet.has(num);
      });

      // true if numberSet contains all numbers in drawingResult
      const isWinningNumberSet = matches.length === drawingResult.length;

      if (!onlyCountWinnings || (onlyCountWinnings && isWinningNumberSet)) {
        drawingResult.forEach((num) => {
          appearances[num] = (appearances[num] || 0) + 1;
        });
        numTimesLookbackSoFar++;
      }
    }

    const hasNotAppeared = [...numberSet].filter(
      (num) => appearances[num] === 0
    );

    results[numMaxTimesLookback] = {
      appearances,
      hasNotAppeared,
    };
  });

  return results;
}

function NumberSetStats({ numbers, customNumberSetStats }) {
  return (
    <table className="customNumberSetStatsMatrix">
      <thead>
        <tr>
          <th>N</th>
          {numbers.map((num) => {
            return <th>{num}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {Object.keys(customNumberSetStats)
          .sort((a, b) => {
            return parseInt(a, 10) - parseInt(b, 10);
          })
          .map((numWinningsLookback) => {
            const { appearances, hasNotAppeared } =
              customNumberSetStats[numWinningsLookback];
            return (
              <tr>
                <td>{numWinningsLookback}</td>
                {numbers.map((num) => {
                  return (
                    <td
                      className={classnames({
                        odd: parseInt(num, 10) % 2 !== 0,
                        even: parseInt(num, 10) % 2 === 0,
                      })}>
                      {appearances[num] > 0 ? appearances[num] : ''}
                    </td>
                  );
                })}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

function CustomNumberSetStatsByGroup({ numberSet, customNumberSetStats }) {
  const numbersOrganizedByOddEven = [...numberSet]
    .filter((num) => num % 2 === 0)
    .concat([...numberSet].filter((num) => num % 2 !== 0));

  const numbersSortedAsc = [...numberSet];
  numbersSortedAsc.sort((a, b) => {
    return a === b ? 0 : a > b ? 1 : -1;
  });

  return (
    <>
      {/* All numbers */}
      <div className="customNumberSetStatsGroup scrollable">
        <h4>Tất cả (nhỏ tới lớn)</h4>
        <NumberSetStats
          numbers={numbersSortedAsc}
          customNumberSetStats={customNumberSetStats}
        />
      </div>
      <div className="customNumberSetStatsGroup scrollable">
        <h4>Tất cả (chẵn trước lẻ sau)</h4>
        <NumberSetStats
          numbers={numbersOrganizedByOddEven}
          customNumberSetStats={customNumberSetStats}
        />
      </div>
      <div className="customNumberSetStatsByGroupContainer scrollable">
        {/* Organized by group */}
        {['0x', '1x', '2x', '3x', '4x', '5x'].map((numberGroup) => {
          const numbersInThisNumberGroup = [...numberSet].filter((num) => {
            return `${num[0]}x` === numberGroup;
          });

          const numbers = numbersInThisNumberGroup
            .filter((num) => num % 2 === 0)
            .concat(numbersInThisNumberGroup.filter((num) => num % 2 !== 0));

          return (
            <div className="customNumberSetStatsGroup">
              <h4>Nhóm {numberGroup}</h4>
              <NumberSetStats
                numbers={numbers}
                customNumberSetStats={customNumberSetStats}
              />
            </div>
          );
        })}
      </div>
      <div className="customNumberSetStatsByGroupContainer vertical">
        {/* Organized by group */}
        {['0x', '1x', '2x', '3x', '4x', '5x'].map((numberGroup) => {
          const numbersInThisNumberGroup = [...numberSet].filter((num) => {
            return `${num[0]}x` === numberGroup;
          });

          const numbers = numbersInThisNumberGroup
            .filter((num) => num % 2 === 0)
            .concat(numbersInThisNumberGroup.filter((num) => num % 2 !== 0));

          return (
            <div className="customNumberSetStatsGroup">
              <h4>Nhóm {numberGroup}</h4>
              <NumberSetStats
                numbers={numbers}
                customNumberSetStats={customNumberSetStats}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function CustomNumberSet() {
  // User this for testing
  const seedNumberSet = new Set([
    '02',
    '03',
    '10',
    '15',
    '19',
    '35',
    '38',
    '43',
    '50',
  ]);

  const numberSetInputRef = useRef(null);
  const { state } = useContext(AppContext);
  const { originalDrawings, originalAnalytics } = state;
  const [nValues, setNValues] = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    25,
    30,
    35,
    40,
    45,
    50,
    100,
    150,
    200,
    originalDrawings.length,
  ]);
  const [onlyCountWinnings, setOnlyCountWinnings] = useState(false);
  const {
    dateOverall,
    metadata: { allPossibleNumbers },
  } = originalAnalytics;
  const [numberSet, setNumberSet] = useState(allPossibleNumbers); // change to seedNumberSet for testing
  const customNumberSetStats = calculateCustomNumberSetStats({
    nValues,
    numberSet,
    dateOverall,
    onlyCountWinnings,
  });

  return (
    <div>
      <div>
        <input
          id="customNumberSet"
          type="text"
          placeholder="Bộ số bất kỳ"
          defaultValue={[...numberSet].join(' ')}
          ref={numberSetInputRef}
        />
        <button
          onClick={() => {
            const inputValue = (numberSetInputRef.current.value || '').trim();
            const newNumberSet = inputValue.length ? inputValue.split(' ') : [];

            setNumberSet(new Set(newNumberSet));
          }}>
          Set
        </button>
        <br />
        <div>
          <input
            id="onlyCountWinningsCb"
            type="checkbox"
            checked={onlyCountWinnings}
            onChange={() => {
              setOnlyCountWinnings(!onlyCountWinnings);
            }}
          />
          <label for="onlyCountWinningsCb">Chỉ tính những lần trúng</label>
        </div>
      </div>

      <CustomNumberSetStatsByGroup
        numberSet={numberSet}
        customNumberSetStats={customNumberSetStats}
      />
    </div>
  );
}
