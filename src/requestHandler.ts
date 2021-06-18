import { getRandomWikiArticles } from './wiki';
import { getRandomRedditPosts } from './reddit';
import { apiResponse } from './scripts/shuffleArray';

const lastUsedTimestamp = Date.now() - 60000;
const emptyResponse: apiResponse = {
  text: '',
  originalText: '',
  indexOfAnswer: 0,
  list: [],
  link: ''
};
const lastResponseServers: Array<string | false> = [];
const ratelimits = {
  wiki: {
    lastUsedTimestamp: lastUsedTimestamp,
    lastResponse: emptyResponse,
    lastResponseServers: lastResponseServers,
    time: 5000
  },
  reddit: {
    lastUsedTimestamp: lastUsedTimestamp,
    lastResponse: emptyResponse,
    lastResponseServers: lastResponseServers,
    time: 10000
  }
}

type possibleAPIs = "reddit" | "wiki";
export async function getResponse(api: possibleAPIs, serverID: string | false): Promise<apiResponse>  {
  const ratelimit = ratelimits[api];

  // If the last request happened less than 5 seconds ago and the server has not yet used the last request,
  // return it. Otherwise, return a completely new request.
  // This edge case only happens in a server where multiple games were started in 5 seconds.
  if (Date.now() - ratelimit.lastUsedTimestamp < ratelimit.time && serverID) {
    if (ratelimit.lastResponseServers.includes(serverID)) {
      await getResponse(api, false);
    }

    ratelimit.lastResponseServers.push(serverID)
    return ratelimit.lastResponse;
  }
  
  ratelimit.lastUsedTimestamp = Date.now();

  let response: apiResponse = emptyResponse;
  switch (api) {
    case 'wiki':
      response = await getRandomWikiArticles();
    break;

    case 'reddit':
      response = await getRandomRedditPosts();
    break;
  }

  ratelimit.lastResponse = response;
  ratelimit.lastResponseServers = [serverID];

  return response;
}