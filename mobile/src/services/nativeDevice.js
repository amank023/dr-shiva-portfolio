import { NativeModules, Platform } from 'react-native';

const { ClinicalNativeModule } = NativeModules;

export const getNativeDeviceInfo = async () => {
  if (Platform.OS === 'android' && ClinicalNativeModule?.getDeviceInfo) {
    try {
      return await ClinicalNativeModule.getDeviceInfo();
    } catch (e) {
      console.warn('Native module error:', e.message);
    }
  }
  return {
    osVersion: Platform.Version,
    platform: Platform.OS,
    brand: 'Android',
    model: 'Device',
    appEdition: 'Dr. Shiva Admin Native'
  };
};

export const showNativeToast = (message) => {
  if (Platform.OS === 'android' && ClinicalNativeModule?.showToast) {
    ClinicalNativeModule.showToast(message);
  }
};

export const nativeDirectDial = (phoneNumber) => {
  if (Platform.OS === 'android' && ClinicalNativeModule?.directDial) {
    ClinicalNativeModule.directDial(phoneNumber);
  }
};
