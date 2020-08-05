import React, {useContext, useRef, useState} from 'react';
import AppContext from '../data/app-context';
import classnames from 'classnames';
import './CustomNumberSet.css';

/** Thong ke theo so lan trung */
function calculateCustomNumberSetStats({
  nValues = [],
  numberSet = new Set(),
  dateOverall = {},
  onlyCountWinnings = false
}) {
  const results = {};
  const dates = Object.keys(dateOverall);

  nValues.forEach(numMaxTimesLookback => {
    const appearances = {};

    // Set count for each number in the numberSet to 0
    [...numberSet].forEach(num => {
      appearances[num] = 0;
    });

    let numTimesLookbackSoFar = 0;

    for (
      let i = 0, len = dates.length;
      i < len && numTimesLookbackSoFar < numMaxTimesLookback;
      i++
    ) {
      const drawingDate = dates[i];
      const {drawingResult} = dateOverall[drawingDate];
      const matches = drawingResult.filter(num => {
        return numberSet.has(num);
      });

      // true if numberSet contains all numbers in drawingResult
      const isWinningNumberSet = matches.length === drawingResult.length;

      if (!onlyCountWinnings || (onlyCountWinnings && isWinningNumberSet)) {
        drawingResult.forEach(num => {
          appearances[num] = (appearances[num] || 0) + 1;
        });
        numTimesLookbackSoFar++;
      }
    }

    const hasNotAppeared = [...numberSet].filter(num => appearances[num] === 0);

    results[numMaxTimesLookback] = {
      appearances,
      hasNotAppeared
    };
  });

  return results;
}

function CustomNumberSetStatsByGroup({numberSet, customNumberSetStats}) {
  return (
    <div className="customNumberSetStatsByGroupContainer">
      {['0x', '1x', '2x', '3x', '4x', '5x'].map(numberGroup => {
        const numbersInThisNumberGroup = [...numberSet].filter(num => {
          return `${num[0]}x` === numberGroup;
        });

        const oddNumbersInThisNumberGroup = numbersInThisNumberGroup.filter(
          num => parseInt(num, 10) % 2 !== 0
        );
        const evenNumbersInThisNumberGroup = numbersInThisNumberGroup.filter(
          num => parseInt(num, 10) % 2 === 0
        );

        const headers = evenNumbersInThisNumberGroup.concat(
          oddNumbersInThisNumberGroup
        );

        return (
          <div className="customNumberSetStatsGroup">
            <h4>Nhóm {numberGroup}</h4>
            <table className="customNumberSetStatsMatrix">
              <thead>
                <tr>
                  <th>N</th>
                  {headers.map(num => {
                    return <th>{num}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {Object.keys(customNumberSetStats)
                  .sort((a, b) => {
                    return parseInt(a, 10) - parseInt(b, 10);
                  })
                  .map(numWinningsLookback => {
                    const {appearances, hasNotAppeared} = customNumberSetStats[
                      numWinningsLookback
                    ];
                    return (
                      <tr>
                        <td>{numWinningsLookback}</td>
                        {headers.map(num => {
                          return (
                            <td
                              className={classnames({
                                odd: parseInt(num, 10) % 2 !== 0,
                                even: parseInt(num, 10) % 2 === 0
                              })}
                            >
                              {appearances[num] > 0 ? appearances[num] : ''}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function CustomNumberSetStats(props) {
  const {numberSet, drawings, numWinningsLookback, dateOverall} = props;
  const dates = Object.keys(dateOverall);
  const appearances = {};
  let numWinningsSoFar = 0;

  for (
    let i = 0, len = dates.length;
    i < len && numWinningsSoFar < numWinningsLookback;
    i++
  ) {
    const drawingDate = dates[i];
    const {drawingResult} = dateOverall[drawingDate];
    const matches = drawingResult.filter(num => {
      return numberSet.has(num);
    });

    // true if numberSet contains all numbers in drawingResult
    const isWinningNumberSet = matches.length === drawingResult.length;

    if (isWinningNumberSet) {
      drawingResult.forEach(num => {
        appearances[num] = (appearances[num] || 0) + 1;
      });
      numWinningsSoFar++;
    }
  }

  const hasNotAppeared = [...numberSet].filter(
    num => !appearances.hasOwnProperty(num)
  );

  return (
    <div className="customNumberSetStats">
      <h4>{numWinningsLookback} lần trúng gần nhất</h4>
      <br />
      <div>
        <h4>Chẵn</h4>
        <div className="numberSetNumberFrequencyContainer">
          {Object.keys(appearances)
            .filter(num => parseInt(num, 10) % 2 === 0)
            .sort()
            .map(num => {
              const numAppearances = appearances[num];
              return (
                <div className="numberSetNumberFrequency">
                  <span>{num}</span>
                  <span>{numAppearances}</span>
                </div>
              );
            })}
        </div>
        <br />
        <h4>Lẻ</h4>
        <div className="numberSetNumberFrequencyContainer">
          {Object.keys(appearances)
            .filter(num => parseInt(num, 10) % 2 !== 0)
            .sort()
            .map(num => {
              const numAppearances = appearances[num];
              return (
                <div className="numberSetNumberFrequency">
                  <span>{num}</span>
                  <span>{numAppearances}</span>
                </div>
              );
            })}
        </div>
        {hasNotAppeared.length > 0 && (
          <>
            <br />
            <h4>Chưa xuất hiện</h4>
            <div className="hasNotAppeared">
              {hasNotAppeared.map(num => {
                return <span className="mono">{num}</span>;
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CustomNumberSet() {
  // User this for testing
  const seedNumberSet = new Set([
    '02',
    '03',
    '04',
    '05',
    '08',
    '09',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '24',
    '25',
    '27',
    '28',
    '29',
    '30',
    '32',
    '34',
    '40',
    '41',
    '42',
    '43'
  ]);

  const numberSetInputRef = useRef(null);
  const {state} = useContext(AppContext);
  const {originalDrawings, originalAnalytics} = state;
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
    15,
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
    originalDrawings.length
  ]);
  const [onlyCountWinnings, setOnlyCountWinnings] = useState(false);
  const {
    dateOverall,
    metadata: {allPossibleNumbers}
  } = originalAnalytics;
  const [numberSet, setNumberSet] = useState(allPossibleNumbers);
  const customNumberSetStats = calculateCustomNumberSetStats({
    nValues,
    numberSet,
    dateOverall,
    onlyCountWinnings
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
          }}
        >
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

      {/* {numberSet !== null && numberSet.size > 0 && (
        <table className="customNumberSetStatsMatrix">
          <thead>
            <tr>
              <th>N</th>
              {[...numberSet].sort().map(num => {
                return <th>{num}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {Object.keys(customNumberSetStats)
              .sort((a, b) => {
                return parseInt(a, 10) - parseInt(b, 10);
              })
              .map(numWinningsLookback => {
                const {appearances, hasNotAppeared} = customNumberSetStats[
                  numWinningsLookback
                ];
                return (
                  <tr>
                    <td>{numWinningsLookback}</td>
                    {[...numberSet].sort().map(num => {
                      return (
                        <td>{appearances[num] > 0 ? appearances[num] : ''}</td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      )} */}
    </div>
  );
}
