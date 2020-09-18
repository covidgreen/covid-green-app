import NetInfo from '@react-native-community/netinfo';
import {urls} from 'constants/urls';

// Strip any trailing '/' if there is one
const match = urls.api.match(/^(.*?)\/?$/);
const healthcheckUrl = match ? `${match[1]}/healthcheck` : null;

export const configureNetInfo = () => {
  if (healthcheckUrl) {
    NetInfo.configure({
      reachabilityUrl: healthcheckUrl,
      reachabilityTest: async (response) => response.status === 204,
      reachabilityLongTimeout: 60 * 1000, // 60s
      reachabilityShortTimeout: 5 * 1000, // 5s
      reachabilityRequestTimeout: 15 * 1000 // 15s
    });
  } else {
    // Don't risk leaking data if env var is somehow missing
    throw new Error('API_HOST URL is missing from build environment variables');
  }
};

export const testNetinfo = () => {
  try {
    NetInfo.fetch().then((state) => console.log('Netinfo state:', state));
  } catch (err) {
    console.log('Netinfo error:', err);
  }
};
