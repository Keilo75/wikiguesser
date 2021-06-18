import { getRandomWikiArticles } from './wiki';
import { apiResponse } from './scripts/shuffleArray';

const lastUsedTimestamp = Date.now() - 5000;
const emptyResponse: apiResponse = {
  text: '',
  originalText: '',
  indexOfAnswer: 0,
  list: []
};
const lastResponseServers: Array<string | false> = [];

const ratelimit = {
  lastUsedTimestamp: lastUsedTimestamp,
  lastResponse: emptyResponse,
  lastResponseServers: lastResponseServers
}

export async function getResponse(serverID: string | false): Promise<apiResponse>  {
  // If the last request happened less than 5 seconds ago and the server has not yet used the last request,
  // return it. Otherwise, return a completely new request.
  // This edge case only happens in a server where multiple games were started in 5 seconds.
  if (Date.now() - ratelimit.lastUsedTimestamp < 5000 && serverID) {
    if (ratelimit.lastResponseServers.includes(serverID)) {
      await getResponse(false);
    }

    ratelimit.lastResponseServers.push(serverID)
    return ratelimit.lastResponse;
  }
  
  ratelimit.lastUsedTimestamp = Date.now();

  const response = await getRandomWikiArticles();

  ratelimit.lastResponse = response;
  ratelimit.lastResponseServers = [serverID];

  return response;
}