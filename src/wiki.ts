import fetch from 'node-fetch';
const url = 'https://en.wikipedia.org/api/rest_v1/page';
let lastUsedTimestamp = 0;

interface Response {
  text: string;
  originalText: string;
  indexOfAnswer: number;
  list: string[];
}

let lastResponse: Response;

export async function getRandomArticles(): Promise<Response> {        
  // Ratelimit function as to not spam Wikipedia's api
  if ((Date.now() - lastUsedTimestamp) < 5000) {
    return lastResponse;
  }

  // Update timestamp
  lastUsedTimestamp = Date.now();

  const response: Response = {
    text: '',
    originalText: '',
    indexOfAnswer: 0,
    list: []
  }

  let firstArticleTitle = '';
  for (let i = 0; i < 4; i++) {
    const res = await fetch(`${url}/random/summary`, { headers: { 'User-Agent': 'wikiguessr/0.1 (https://github.com/Keilo75/wikiguesser) node-fetch ' } });
    
    let data = { title: '', extract: '' };
    try {
      data = await res.json();
    } catch {
      console.log('Something went wrong.')
      console.log(res)
    }

    if (i === 0) {
      response.text = formatResponse(data.title, data.extract);
      response.originalText = data.extract;
      firstArticleTitle = data.title;
    }

    response.list.push(data.title);
  }

  // Randomize order (Courtesy of https://stackoverflow.com/a/12646864)
  for (let i = response.list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [response.list[i], response.list[j]] = [response.list[j], response.list[i]];
  }
  response.indexOfAnswer = response.list.indexOf(firstArticleTitle);

  lastResponse = response;

  return response;

}

const censorString = '___';
const specialChars = /[-&\/\\#,+()$~%.'":*?<>{}_]/g;
function formatResponse(title: string, text: string): string {
  // Remove special characters in title
  const forbiddenWords = title.replace('-', ' ').split(' ').map(string => string.replace(specialChars, '').toLowerCase());

  // Remove new lines
  text = text.trim();

  for (let forbiddenWord of forbiddenWords) {
    const splittedText = text.split(' ')
    
    for (let word of splittedText) {
      const wordIndex = splittedText.indexOf(word);
      let formattedWord = word;

      // Check if word is already removed
      if (word.startsWith(censorString)) continue;

      // Check if word is bigger than forbidden word
      if (word.length < forbiddenWord.length) continue;
      
      // Remove every word where the current forbidden word starts with it
      // 'Worlds' will be removed when the forbidden word is 'World'
      if (word.toLowerCase().replace(specialChars, '').startsWith(forbiddenWord)) {
        formattedWord = removeWord(word);
      }
      
      splittedText[wordIndex] = formattedWord;
      
      // Check if adjacent words were removed
      if (formattedWord.includes(censorString) && splittedText[wordIndex - 1] === censorString) splittedText[wordIndex - 1] = 'censoredString';
      if (formattedWord.includes(censorString) && splittedText[wordIndex + 1] === censorString) splittedText[wordIndex + 1] = 'censoredString';
      
    }

    // Remove duplicates 
    text = splittedText.filter(word => word !== 'censoredString').join(' ');
  }
  return text;
}

function removeWord(word: string): string {
  const splittedWord = word.split('');

  // Remove all special characters
  let filteredWord = splittedWord.filter(char => !char.match(specialChars));

  // Find the index of the first and last non special characters
  const firstCharIndex = splittedWord.indexOf(filteredWord[0]);
  const lastCharIndex = splittedWord.lastIndexOf(filteredWord[filteredWord.length - 1]);

  // Remove all non special characters from the array
  splittedWord.splice(firstCharIndex, lastCharIndex - firstCharIndex + 1)
  
  // Add the censored string back
  splittedWord.splice(firstCharIndex, 0, censorString);

  return splittedWord.join('');
}
