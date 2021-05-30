import React, { useState } from 'react';
import './ManualResultEntry.css';

export default function ManualEntry({ lotteryType = 'vietlott645' }) {
  const [drawingDate, setDrawingDate] = useState('');
  const [drawingResult, setDrawingResult] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function isValidDrawingResult(result) {
    if (!result || !result.length) return false;

    const splitResult = result.split(' ');
    if (splitResult.length < 6 || splitResult.length > 7) {
      return false;
    }

    for (let i = 0; i < splitResult.length; i++) {
      if (splitResult[i].length !== 2) {
        return false;
      }
    }

    return true;
  }

  function addResult() {
    const url =
      'https://rgc9a9lhu5.execute-api.us-west-2.amazonaws.com/dev/drawings';
    const validDateRe = /[\d]{4}\/[\d]{2}\/[\d]{2}/gi;

    if (!drawingDate.length || !drawingDate.match(validDateRe)) {
      setError('Ngày tháng không đúng format YYYY/MM/DD');
      return;
    }

    if (!isValidDrawingResult(drawingResult)) {
      setError('Kết quả không đúng format');
      return;
    }

    if (lotteryType) {
      const type =
        lotteryType === 'vietlott645' ? 'vietlott645' : 'vietlott655';

      setIsSubmitting(true);
      setError(null);

      fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          type,
          drawingDate,
          drawingResult,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setError(null);
          window.location.reload();
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }

  return (
    <div className="manualEntry">
      <h1>Thêm kết quả mới</h1>
      <input
        onChange={(evt) => {
          setDrawingDate(evt.target.value.trim());
        }}
        placeholder="Date (YYYY/MM/DD)"
      />
      <input
        onChange={(evt) => {
          setDrawingResult(evt.target.value.trim());
        }}
        placeholder="Ket qua (Vd: 01 04 23 33 43 45)"
      />
      <button disabled={isSubmitting} onClick={addResult}>
        Submit
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
