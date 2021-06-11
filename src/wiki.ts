import fetch from 'node-fetch';
import { shuffleArray, apiResponse } from './scripts/shuffleArray';
import { wiki } from './credentials.json';


export async function getRandomWikiArticles(): Promise<apiResponse> {        
  const apiResponse: apiResponse = {
    text: '',
    originalText: '',
    indexOfAnswer: 0,
    list: []
  }

  const promiseArray = [];
  for (let i = 0; i < 4; i++) {
    promiseArray.push(fetchArticle());
  }
  
  return Promise.all(promiseArray).then(async (values) => {
    let index = 0;
    for (let data of values) {
      const jsonData = await data.json();

      if (index === 0) {
        apiResponse.text = formatResponse(jsonData.title, jsonData.extract);
        apiResponse.originalText = jsonData.extract;
      }

      apiResponse.list.push(jsonData.title);

      index++;
    }

    // Shuffle array
    const shuffledObject = shuffleArray(apiResponse.list);
    apiResponse.list = shuffledObject.array;
    apiResponse.indexOfAnswer = shuffledObject.indexOfAnswer;

    return apiResponse;
  })
}

async function fetchArticle() {
  return await fetch(`${wiki.url}/random/summary`, { headers: { 'User-Agent': wiki.userAgent } });
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
