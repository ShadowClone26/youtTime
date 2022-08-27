import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';
import PushNotification, { Importance } from 'react-native-push-notification';

PushNotification.createChannel({
  channelId:"eventsnotifications",
  channelName:"yourTime notification",
  importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
  vibrate: true,
})

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
