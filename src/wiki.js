const fetch = require('node-fetch');
const url = 'https://en.wikipedia.org/api/rest_v1/page';

async function getRandomArticles() {      
  return formatResponse('Berowra Waters, New South Wales', 'Berowra Waters is an outer suburb of Northern Sydney, in the state of New South Wales, Australia. Berowra is located 40 kilometres north of the Sydney central business district, in the local government area of Hornsby Shire. Berowra Waters is north-west of the suburbs of Berowra Heights and west of Berowra.')
  
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
      // Check if word is longer
      let isForbidden;
      if (forbiddenWord.replace(/[&\/\\#,+()$~%.'":*!?<>{}]/g, '').length <= word.replace(/[&\/\\#,+()$~%.'":*!?<>{}]/g, '').length) {
        isForbidden = forbiddenWord.toLowerCase().replace(/[&\/\\#,+()$~%.'":*!?<>{}]/g, '').startsWith(word.replace(/[&\/\\#,+()$~%.'":*!?<>{}]/g, '').toLowerCase());
      }   

      // Edge cases
      // Bueller's has to detect Bueller
      // Arena should not detect 'a'
      
      if (!isForbidden) continue;
      
      const wordIndex = splittedText.indexOf(word);

      // Handle commas and points
      const specialCharacters = /[.:,;?!"']/;
      const lastCharacter = word[word.length - 1];
      const isPunctuationMark1 = lastCharacter?.match(specialCharacters);
      
      const firstCharacter = word[0];
      const isPunctuationMark2 = firstCharacter.match(specialCharacters);
      
      // If word includes a forbidden word, replace it
      splittedText[wordIndex] = (isPunctuationMark2 ? firstCharacter : '') + '___' + (isPunctuationMark1 ? lastCharacter : '');
      
      // Check if last word is already removed
      if (splittedText[wordIndex - 1]?.includes('___')) splittedText[wordIndex] = (isPunctuationMark2 ? firstCharacter : '') + (isPunctuationMark1 ? lastCharacter : '');
    
    }

    text = splittedText.join(' ');
    
  }

  return text;
}

exports.getRandomArticles = getRandomArticles;