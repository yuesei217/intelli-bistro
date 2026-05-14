// iOS Simulator: use http://localhost:3001
// Physical device (same WiFi): run `ipconfig getifaddr en0` to get your Mac's LAN IP
export const API_BASE_URL = __DEV__
  ? 'http://10.0.0.144:3001'
  : 'https://your-production-url.com';
