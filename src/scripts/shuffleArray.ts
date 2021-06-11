interface ShuffledObject {
  array: string[];
  indexOfAnswer: number;
}

export function shuffleArray(array: string[],): ShuffledObject {
  const actualTitle = array[0];  
  
  // Randomize order (Courtesy of https://stackoverflow.com/a/12646864)
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  const indexOfAnswer = array.indexOf(actualTitle);
  return { array, indexOfAnswer };
}

export interface apiResponse {
  text: string;
  originalText?: string;
  indexOfAnswer: number;
  list: string[];
}