import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, getDefaultApiUrl } from '../config/apiConfig';

export const getStoredToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
  } catch {
    return null;
  }
};

export const setStoredToken = async (token) => {
  try {
    if (token) {
      await AsyncStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    }
  } catch (e) {
    console.warn('Error saving token:', e);
  }
};

export const clearStoredAuth = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
  } catch (e) {
    console.warn('Error clearing auth:', e);
  }
};

export const getStoredApiUrl = async () => {
  try {
    const url = await AsyncStorage.getItem(STORAGE_KEYS.API_BASE_URL);
    return url || getDefaultApiUrl();
  } catch {
    return getDefaultApiUrl();
  }
};

export const setStoredApiUrl = async (url) => {
  try {
    if (url) {
      await AsyncStorage.setItem(STORAGE_KEYS.API_BASE_URL, url.trim().replace(/\/+$/, ''));
    }
  } catch (e) {
    console.warn('Error saving API URL:', e);
  }
};
