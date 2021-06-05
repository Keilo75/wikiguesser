const fetch = require('node-fetch');
const url = 'https://en.wikipedia.org/api/rest_v1/page';

async function getRandomArticles() {        
  const articles = {
    text: '',
    list: []
  }
  
  for (let i = 0; i < 3; i++) {
    // Get random article
    const response = await fetch(`${url}/random/summary`, {
      headers: {
        'User-Agent': 'wikiguessr/0.1 (https://github.com/Keilo75/wikiguesser) node-fetch '
      }
    });
    let data;
    try {
      data = await response.json();
    } catch {
      console.log('Something went wrong. ')
      console.log(response)
    }

    if (i === 0) {
      articles.text = formatResponse(data.title, data.extract);
      articles.originalText = data.extract;
    }

    // Add article
    articles.list.push(data.title);
  }

  return articles;

}

const censorString = '___';
const specialChars = /[-&\/\\#,+()$~%.'":*?<>{}_]/g;
function formatResponse(title, text) {
  // Remove special characters in title
  const forbiddenWords = title.replace('-', ' ').split(' ').map(string => string.replace(specialChars, '').toLowerCase());

  for (forbiddenWord of forbiddenWords) {
    const splittedText = text.split(' ')
    
    for (word of splittedText) {
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

function removeWord(word) {
  word = word.split('')
  // Remove all special characters
  let filteredWord = word.filter(char => !char.match(specialChars));

  // Find the index of the first and last non special characters
  const firstCharIndex = word.indexOf(filteredWord[0]);
  const lastCharIndex = word.lastIndexOf(filteredWord[filteredWord.length - 1]);

  // Remove all non special characters from the array
  word.splice(firstCharIndex, lastCharIndex - firstCharIndex + 1)
  
  // Add the censored string back
  word.splice(firstCharIndex, 0, censorString);

  return word.join('');
}

exports.getRandomArticles = getRandomArticles;