import { getRandomWikiArticles } from './src/wiki';

async function testFile() {
  const response = await getRandomWikiArticles();
  console.log(response);
}

testFile()