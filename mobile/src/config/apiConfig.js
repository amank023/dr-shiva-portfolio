import { Platform } from 'react-native';

// Recommended endpoints based on device environment
export const PRESET_ENDPOINTS = [
  {
    id: 'wifi',
    name: 'Office / Local Wi-Fi (Live Backend)',
    url: 'http://10.161.141.191:5000/api',
    description: 'Direct connection to local Node.js server via Wi-Fi IP'
  },
  {
    id: 'emulator',
    name: 'Android Studio Emulator',
    url: 'http://10.0.2.2:5000/api',
    description: 'Standard Android emulator loopback alias'
  },
  {
    id: 'localhost',
    name: 'Localhost (Web / USB Reverse)',
    url: 'http://localhost:5000/api',
    description: 'Used via adb reverse tcp:5000 tcp:5000'
  },
  {
    id: 'cloud',
    name: 'Netlify Cloud Serverless',
    url: 'https://dr-shiva-portfolio.netlify.app/api',
    description: 'Production Cloud Netlify Serverless API'
  }
];

export const getDefaultApiUrl = () => {
  // If running in Android emulator vs real device
  if (Platform.OS === 'android') {
    return 'http://10.161.141.191:5000/api';
  }
  return 'http://localhost:5000/api';
};

export const STORAGE_KEYS = {
  ADMIN_TOKEN: '@dr_shiva_admin_token',
  API_BASE_URL: '@dr_shiva_api_base_url',
  THEME_MODE: '@dr_shiva_theme_mode'
};
