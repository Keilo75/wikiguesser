const { getRandomArticles } = require('./src/wiki');

getRandomArticles().then(console.log)

setTimeout(async () => {
  getRandomArticles().then(console.log)
}, 3000)



