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

function formatResponse(title, text) {
  const forbiddenWords = title.split(' ');

  // Remove every forbidden word
  for (forbiddenWord of forbiddenWords) {
    // Loop through the text
    const splittedText = text.split(' ');

    for (word of splittedText) {
      let isForbidden = word.toLowerCase().replace(/[&\/\\#,+()$~%.'":*!?<>{}]/g, '').startsWith(forbiddenWord.toLowerCase().replace(/[&\/\\#,+()$~%.'":*!?<>{}]/g, ''));

      // Check initals
      if (forbiddenWord.length === 2 && forbiddenWord[1] === '.') isForbidden = word.startsWith(forbiddenWord[0]);
      
      if (!isForbidden) continue;
      
      const wordIndex = splittedText.indexOf(word);
      // Check if previous element was already removed and remove current element
      if (splittedText[wordIndex - 1] === '???') {
        splittedText.splice(wordIndex, 1);
        continue;
      }

      // Handle commas and points
      const lastCharacter = word[word.length - 1];
      const isPunctuationMark1 = lastCharacter.match(/[.:,;?!"]/);

      const firstCharacter = word[0];
      const isPunctuationMark2 = firstCharacter.match(/[.:,;?!"]/);

    
      // If word includes a forbidden word, replace it
      splittedText[wordIndex] = (isPunctuationMark2 ? firstCharacter : '') + '???' + (isPunctuationMark1 ? lastCharacter : '');
    }
    text = splittedText.join(' ');
    
  }

  return text;
}

exports.getRandomArticles = getRandomArticles;