const shuffle = function(array) {
  const _arr = [...array];
  let currentIndex = _arr.length;
  let temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = _arr[currentIndex];
    _arr[currentIndex] = _arr[randomIndex];
    _arr[randomIndex] = temporaryValue;
  }

  return _arr;
};

export default shuffle;
