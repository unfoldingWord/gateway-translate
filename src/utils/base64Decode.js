import base64 from 'base-64'
import utf8 from 'utf8'

export const decodeBase64ToUtf8 = (encoded) => {
  const bytes = atob(encoded);
  const text = utf8.decode(bytes);
  return text;
};

