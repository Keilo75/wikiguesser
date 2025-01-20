import type { ApiResponse } from "../models/api";
import type { Game } from "../models/game";
import { getRandomElementFromArray } from "./random";

export async function createGame(
  url: string,
  userAgent: string
): Promise<Game> {
  const promises: Promise<ApiResponse>[] = Array.from(
    { length: 4 },
    () =>
      new Promise((r) =>
        fetch(url, { headers: { "User-Agent": userAgent } })
          .then((r) => r.json())
          .then((json) => r(json as ApiResponse))
      )
  );

  const responses = await Promise.all(promises);
  const correctResponse = getRandomElementFromArray(responses);

  return {
    originalText: correctResponse.extract,
    censoredText: censorExtract(correctResponse.title, correctResponse.extract),
    correctOption: correctResponse.title,
    correctOptionUrl: correctResponse.content_urls.desktop.page,
    options: responses.map((r) => r.title),
  };
}

const censorString = "\\_\\_\\_";
const specialChars = /[-&/\\#,+()$~%.'":*?<>{}_]/g;
function censorExtract(title: string, extract: string): string {
  // Remove special characters in title
  const forbiddenWords = title
    .replace("-", " ")
    .split(" ")
    .map((string) => string.replace(specialChars, "").toLowerCase());

  // Remove new lines
  extract = extract.trim();

  for (const forbiddenWord of forbiddenWords) {
    const splittedText = extract.split(" ");

    for (const word of splittedText) {
      const wordIndex = splittedText.indexOf(word);
      let formattedWord = word;

      // Check if word is already removed
      if (word.includes(censorString)) continue;

      // Check if word is bigger than forbidden word
      if (word.length < forbiddenWord.length) continue;

      // Remove every word where the current forbidden word starts with it
      // 'Worlds' will be removed when the forbidden word is 'World'
      if (
        word.toLowerCase().replace(specialChars, "").startsWith(forbiddenWord)
      ) {
        formattedWord = removeWord(word);
      }

      splittedText[wordIndex] = formattedWord;

      // Check if adjacent words were removed
      if (
        formattedWord.includes(censorString) &&
        splittedText[wordIndex - 1] === censorString
      )
        splittedText[wordIndex - 1] = "censoredString";
      if (
        formattedWord.includes(censorString) &&
        splittedText[wordIndex + 1] === censorString
      )
        splittedText[wordIndex + 1] = "censoredString";
    }

    // Remove duplicates
    extract = splittedText
      .filter((word) => word !== "censoredString")
      .join(" ");
  }
  return extract;
}

function removeWord(word: string): string {
  const splittedWord = word.split("");

  // Remove all special characters
  const filteredWord = splittedWord.filter((char) => !char.match(specialChars));

  // Find the index of the first and last non special characters
  const firstCharIndex = splittedWord.indexOf(filteredWord[0]);
  const lastCharIndex = splittedWord.lastIndexOf(
    filteredWord[filteredWord.length - 1]
  );

  // Remove all non special characters from the array
  splittedWord.splice(firstCharIndex, lastCharIndex - firstCharIndex + 1);

  // Add the censored string back
  splittedWord.splice(firstCharIndex, 0, censorString);

  return splittedWord.join("");
}
