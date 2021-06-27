import chalk from 'chalk';

type PrintType = 'status' | 'error' | 'commands' | 'guild';

export default function print(type: PrintType, text: string): void {
  const consoleText = [];
  const uppercaseType = type.toUpperCase();
  
  // Get variables
  const textArray = text.split(' ');
  
  for (let word of textArray) {    
    if (word.match(/\§([^]+)\§([^\s]+)/)) {
      // Remove first § and split text before and after
      const splittedWord = word.substring(1).split('§');
      
      consoleText.push(chalk.bold(splittedWord[0]) + splittedWord[1]);
    } else {
      consoleText.push(word);
    }
  }

  switch (type) {
    case 'status':
      consoleText.unshift(chalk.green.bold(uppercaseType));
    break;

    case 'error':
      consoleText.unshift(chalk.red.bold(uppercaseType));  
    break;

    case 'commands':
      consoleText.unshift(chalk.blueBright.bold(uppercaseType));  
    break;

    case 'guild':
      consoleText.unshift(chalk.magenta.bold(uppercaseType));
    break;
  }
    
    console.log(consoleText.join(' '));
  

}