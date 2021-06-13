import { getResponse } from './src/requestHandler';

async function testFile() {
  console.log(await getResponse("wiki", "h"));
  console.log(await getResponse("wiki", "f"));
  console.log(await getResponse("wiki", "h"));
}

testFile()