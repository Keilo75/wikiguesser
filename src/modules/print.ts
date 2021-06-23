import chalk from 'chalk';

type PrintType = 'status' | 'error';

export default function print(type: PrintType, text: string): void {
  // Add spaces to type
  const addedSpaces = 2;
  const spacedTypeArray = type.split('');
  for (let i = 0; i < addedSpaces; i++) {
    spacedTypeArray.push(' ');
    spacedTypeArray.unshift(' ');
  }
  const spacedType = spacedTypeArray.join('').toUpperCase();
  const consoleText = [];
  
  // Get variables
  const textArray = text.split(' ');
  for (let word of textArray) {    
    if (word.match(/\§([^]+)\§/)) {
      word = word.replace(/\§/g, '');
      consoleText.push(chalk.bold(word));
    } else {
      consoleText.push(word);
    }
  }

  switch (type) {
    case 'status':
      consoleText.unshift(chalk.bgGreen.black(spacedType));
      console.log(consoleText.join(' '));
    break;

    case 'error':
      consoleText.unshift(chalk.bgRed.white(spacedType));  
      console.log(consoleText.join(' '));
    break;
  }

  

}