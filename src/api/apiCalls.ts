import * as fetch from 'node-fetch';
import { HTTP_API_TOKEN } from '../constants/secrets';
import {
  GET_CHAT_MEMBER,
  GET_CHAT_MEMBERS_COUNT,
  POST_PIN_MESSAGE,
  POST_SEND_MESSAGE,
} from '../constants/apiUrl';

const REQUEST_PATH = 'https://api.telegram.org/bot' + HTTP_API_TOKEN + '/';

export const getChatMembersCount = async (chat_id: String): Promise<Number> => {
  const url = REQUEST_PATH + GET_CHAT_MEMBERS_COUNT + '?chat_id=' + chat_id;
  const result: any = await getData(url);
  return parseInt(JSON.stringify(result.result));
};

export const sendChatMessage = async (chat_id: String, text: String): Promise<any> => {
  const url = REQUEST_PATH + POST_SEND_MESSAGE;
  const body = {
    chat_id: chat_id,
    text: text,
  };
  const result: any = await postData(url, body);
  return result.result;
};

export const getChatMember = async (chat_id: String, user_id: String): Promise<any> => {
  const url = REQUEST_PATH + GET_CHAT_MEMBER + '?chat_id=' + chat_id + '&user_id=' + user_id;
  const result: any = await getData(url);
  return result.result;
};

export const pinChatMessage = async (
  chat_id: String,
  message_id: String,
  disableNotify: Boolean
) => {
  const url = REQUEST_PATH + POST_PIN_MESSAGE;
  const body = {
    chat_id: chat_id,
    message_id: message_id,
    disable_notification: disableNotify,
  };
  const result: any = await postData(url, body);
  return result.result;
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
