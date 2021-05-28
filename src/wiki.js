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
        'User-Agent': 'wikiguessr/0.1 (https://github.com/Keilo75/wikiguesser) fetch '
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
  const forbiddenWords = title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').split(' ');
  
  // Remove every forbidden word
  for (forbiddenWord of forbiddenWords) {
    // Loop through the text
    const splittedText = text.split(' ');

    for (word of splittedText) {
      if (!word.toLowerCase().includes(forbiddenWord.toLowerCase())) continue;
      
      const wordIndex = splittedText.indexOf(word);
      // Check if previous element was already removed and remove current element
      if (splittedText[wordIndex - 1] === '???') {
        splittedText.splice(wordIndex, 1);
        continue;
      }

      // If word includes a forbidden word, replace it
      splittedText[wordIndex] = '???';
    }
    text = splittedText.join(' ');
    
  }

  return text;
}

