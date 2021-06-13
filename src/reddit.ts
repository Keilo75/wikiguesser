import fetch from 'node-fetch';
import { shuffleArray, apiResponse } from './scripts/shuffleArray';
import { reddit } from './credentials.json';
import snoowrap from 'snoowrap';

// Create reddit client
const r = new snoowrap(reddit.user);

export async function getRandomRedditPosts() /*Promise<apiResponse>*/ {        
  const apiResponse: apiResponse = {
    text: '',
    originalText: '',
    indexOfAnswer: 0,
    list: []
  }

  return apiResponse;
}

async function fetchPost() {
  const response = await r.getSubreddit("askReddit").getTop({ time: 'week', limit: 1});

  console.log(response)
}