export type ChatEngineOptions = any // TODO;

export function parseSource (uri?: string) {
  if (!uri) {
    return 'Unknown';
  }
  if (/^https:\/\//.test(uri)) {
    return new URL(uri).hostname;
  } else {
    return uri;
  }
}
