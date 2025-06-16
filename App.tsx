import { StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { NotificationClickEvent, OneSignal } from 'react-native-onesignal'; // https://documentation.onesignal.com/docs/react-native-expo-sdk-setup

import { Routes } from './src/routes';

import { THEME } from './src/theme';
import { Loading } from './src/components/Loading';

import { CartContextProvider } from './src/contexts/CartContext';
import { tagUserInfoCreate } from './src/notifications/notificationsTags';
import { useEffect } from 'react';

OneSignal.initialize("726404ba-444d-4c70-9ed2-f5d6cb13e8ac");
OneSignal.Notifications.requestPermission(true);

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  // Cria as tags do usuário
  tagUserInfoCreate();

  useEffect(()=> {
    const handleNotificationClick = (event: NotificationClickEvent): void => {
      // Controla funcionalidades de botoes das notificações
      const { actionId } = event.result

      if (actionId === "1") {
        return console.log("Ver todos")
      }

      if (actionId === "2") {
        return console.log("Ver pedido")
      }
    }

    OneSignal.Notifications.addEventListener("click", handleNotificationClick)

    return () => 
      OneSignal.Notifications.removeEventListener("click", handleNotificationClick)

  }, [])

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <CartContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </CartContextProvider>
    </NativeBaseProvider>
  );
}