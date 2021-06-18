import { getResponse } from './src/requestHandler';

async function testFile() {
  console.log(await getResponse("reddit", "h"));
}

testFile()