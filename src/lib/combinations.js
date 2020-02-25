export default function combinations(arr, k) {
  return util(arr, k, 0);
}

function util(arr, k, start) {
  if (k === 1) {
    return arr.slice(start, arr.length);
  }

  const result = [];

  for (let i = start; i <= arr.length - k; i++) {
    const firstIndex = arr[i];
    const subCombinations = util(arr, k - 1, i + 1, arr.length - 1);
    subCombinations.forEach(comb => {
      result.push([firstIndex].concat(comb));
    });
  }

  return result;
}
