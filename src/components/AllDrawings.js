import React, {useContext} from 'react';
import AppContext from '../data/app-context';

export default function AllDrawings() {
  const {
    state: {drawings},
    dispatch
  } = useContext(AppContext);

  return (
    <div className="AllDrawings">
      <h2>Ket qua cu</h2>
      {drawings &&
        drawings.map(drawing => {
          const {drawingResult, drawingDate} = drawing;
          return (
            <div>
              <code>
                {drawingDate}: {drawingResult}
              </code>
            </div>
          );
        })}
    </div>
  );
}
