// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffle = <T>(array: T[])=> {
  const shallowArrayCopy = array.slice();
  for (let i = shallowArrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shallowArrayCopy[i];
    shallowArrayCopy[i] = shallowArrayCopy[j];
    shallowArrayCopy[j] = temp;
  }
  return shallowArrayCopy;
}