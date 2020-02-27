import {useEffect, useState} from 'react';
import {
  ALL_NUMBERS_645,
  ALL_NUMBERS_655,
  TYPE_VIETLOTT645,
  TYPE_VIETLOTT655
} from '../constants';
import stats from '../lib/analytics';

function typeToAllNumbers(type) {
  if (type === TYPE_VIETLOTT655) {
    return ALL_NUMBERS_655;
  }

  return ALL_NUMBERS_645;
}

export default function useAnalytics(config) {
  const [analytics, setAnalytics] = useState(null);
  let {drawings = [], limit = null, type = TYPE_VIETLOTT645} = config;

  useEffect(() => {
    if (!drawings) {
      setAnalytics(null);
    } else {
      let _d = [...drawings];
      _d = _d || [];
      _d = limit ? _d.slice(0, limit) : _d;

      // return analysis;
      const res = stats(_d, {
        allPossibleNumbers: typeToAllNumbers(type)
      });

      setAnalytics(res);
    }
  }, [drawings, limit, type]);

  return analytics;
}
