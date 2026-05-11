import liff from '@line/liff';

export const initLiff = async (liffId) => {
  try {
    await liff.init({ liffId });
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  } catch (error) {
    console.error('LIFF Initialization failed', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    return await liff.getProfile();
  } catch (error) {
    console.error('Failed to get LIFF profile', error);
    return null;
  }
};

export const closeWindow = () => {
  liff.closeWindow();
};
