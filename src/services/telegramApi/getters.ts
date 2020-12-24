import * as fetch from 'node-fetch';
import { HTTP_API_TOKEN } from '../../constants/secrets';
import { GET_CHAT, GET_CHAT_MEMBERS_COUNT } from '../../constants/apiUrl';

const REQUEST_PATH = 'https://api.telegram.org/bot' + HTTP_API_TOKEN + '/';

export const getChat = async (chat_id: string): Promise<Object> => {
  const url = REQUEST_PATH + GET_CHAT + '?chat_id=' + chat_id;
  const result = await getData(url);
  return result;
};

export const getChatMembersCount = async (chat_id: string): Promise<Number> => {
  const url = REQUEST_PATH + GET_CHAT_MEMBERS_COUNT + '?chat_id=' + chat_id;
  const result: any = await getData(url);
  return parseInt(JSON.stringify(result.result));
};

async function getData(url): Promise<Object> {
  const response = await fetch(url);
  const result = await response.json();
  return result;
}
