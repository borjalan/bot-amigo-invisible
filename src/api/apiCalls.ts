import * as fetch from 'node-fetch';
import { HTTP_API_TOKEN } from '../constants/secrets';
import { GET_CHAT, GET_CHAT_MEMBERS_COUNT, POST_SEND_MESSAGE } from '../constants/apiUrl';

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

export const sendChatMessage = async (chat_id: String, text: String): Promise<Number> => {
  const url = REQUEST_PATH + POST_SEND_MESSAGE;
  const body = {
    chat_id: chat_id,
    text: text,
  };
  const result: any = await postData(url, body);
  return parseInt(JSON.stringify(result.result));
};

async function getData(url): Promise<Object> {
  const response = await fetch(url);
  const result = await response.json();
  return result;
}

async function postData(url, body): Promise<Object> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  return result;
}
