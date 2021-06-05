const fetch = require('node-fetch');
const url = 'https://en.wikipedia.org/api/rest_v1/page';

async function getRandomArticles() {      
  return formatResponse('Berowra Waters, New South Wales', 'Berowra Waters is an outer suburb of Northern Sydney, in the state of New South Wales, Australia. Berowra is located 40 kilometres north of the Sydney central business district, in the local government area of Hornsby Shire. Berowra Waters is north-west of the suburbs of Berowra Heights and west of Berowra.')
  // Berowra Waters, New South Wales
  
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
  const forbiddenWords = title.split(' ').map(string => string.replace(specialChars, '').toLowerCase());

  for (forbiddenWord of forbiddenWords) {
    const splittedText = text.split(' ').map(word => {
      // Check if word is already removed
      if (word.startsWith(censorString)) return word;
      
      // Remove every word where the current forbidden word starts with it
      // 'Worlds' will be removed when the forbidden word is 'World'
      if (forbiddenWord.startsWith(word.toLowerCase().replace(specialChars, ''))) return removeWord(word);
  
      return word;
    });

    text = splittedText.join(' ');
  }
  return text;
}

function removeWord(word) {
  word = word.split('')
  // Remove all special characters
  let filteredWord = word.filter(char => !char.match(specialChars));

  // Find the index of the first and last non special characters
  const firstCharIndex = word.indexOf(filteredWord[0]);
  const lastCharIndex = word.indexOf(filteredWord[filteredWord.length - 1]);

  // Remove all non special characters from the array
  word.splice(firstCharIndex, lastCharIndex - firstCharIndex + 1)
  
  // Add the censored string back
  word.splice(firstCharIndex, 0, censorString);

  return word.join('');
}

exports.getRandomArticles = getRandomArticles;