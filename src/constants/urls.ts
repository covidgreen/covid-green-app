import {API_HOST, KEY_DOWNLOAD_HOST, KEY_PUBLISH_HOST} from '@env';

console.log('API_HOST', API_HOST);
console.log('KEY_DOWNLOAD_HOST', KEY_DOWNLOAD_HOST);
console.log('KEY_PUBLISH_HOST', KEY_PUBLISH_HOST);

export const urls = {
  api: API_HOST,
  keyDownload: KEY_DOWNLOAD_HOST,
  keyPublish: KEY_PUBLISH_HOST
};
