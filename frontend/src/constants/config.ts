import Constants from 'expo-constants';

function getApiBaseUrl(): string {
  // In development: derive host from Metro's own address so it works on real devices
  // without any IP configuration. hostUri is e.g. "10.0.0.144:8081".
  if (__DEV__) {
    const host = (Constants.expoConfig?.hostUri ?? 'localhost:8081').split(':')[0];
    return `http://${host}:3001`;
  }
  return process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';
}

export const API_BASE_URL = getApiBaseUrl();
