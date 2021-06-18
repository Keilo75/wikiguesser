import { getResponse } from './src/requestHandler';

async function testFile() {
  console.log(await getResponse("h"));
  console.log(await getResponse("f"));
  console.log(await getResponse("h"));
}

testFile()