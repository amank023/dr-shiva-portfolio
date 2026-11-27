import { Platform } from 'react-native';

// Current active development machine IP
export const CURRENT_HOST_IP = '10.235.130.191';

// Preset endpoints based on device environment
export const PRESET_ENDPOINTS = [
  {
    id: 'usb',
    name: 'USB Cable (adb reverse)',
    url: 'http://127.0.0.1:5000/api',
    description: 'Direct high-speed USB connection (adb reverse tcp:5000 tcp:5000)'
  },
  {
    id: 'wifi',
    name: `Wi-Fi LAN (${CURRENT_HOST_IP})`,
    url: `http://${CURRENT_HOST_IP}:5000/api`,
    description: `Connect to development PC over local Wi-Fi (${CURRENT_HOST_IP}:5000)`
  },
  {
    id: 'emulator',
    name: 'Android Studio Emulator (10.0.2.2)',
    url: 'http://10.0.2.2:5000/api',
    description: 'Android Studio emulator host bridge'
  },
  {
    id: 'localhost',
    name: 'Localhost (Web / Loopback)',
    url: 'http://localhost:5000/api',
    description: 'Loopback address for web and direct local testing'
  },
  {
    id: 'cloud',
    name: 'Netlify Cloud Serverless',
    url: 'https://dr-shiva-portfolio.netlify.app/api',
    description: 'Production Cloud Netlify Serverless API'
  }
];

export const API_PRESETS = PRESET_ENDPOINTS;

export const CANDIDATE_URLS = [
  'http://127.0.0.1:5000/api',
  `http://${CURRENT_HOST_IP}:5000/api`,
  'http://localhost:5000/api',
  'http://10.0.2.2:5000/api'
];

export const getDefaultApiUrl = () => {
  if (Platform.OS === 'android') {
    // Default to 127.0.0.1 (USB adb reverse is most stable for connected devices)
    return 'http://127.0.0.1:5000/api';
  }
  return 'http://localhost:5000/api';
};

export const STORAGE_KEYS = {
  ADMIN_TOKEN: '@dr_shiva_admin_token',
  API_BASE_URL: '@dr_shiva_api_base_url',
  THEME_MODE: '@dr_shiva_theme_mode'
};
