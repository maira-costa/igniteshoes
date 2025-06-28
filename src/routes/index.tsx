import { useEffect, useState } from 'react';
import { NotificationWillDisplayEvent, OneSignal, OSNotification } from 'react-native-onesignal';
import { useTheme } from 'native-base';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { AppRoutes } from './app.routes';
import { Notification } from '../components/Notification';

/*
  -- Configurações do deeplink: doc https://reactnavigation.org/docs/deep-linking/
  1- adicionar o scheme em app.json
  2- fazer o prebuild: npx expo prebuild
  3- verificar se sheme foi adicionado:  npx uri-scheme list
  4- fazer a build: npx expo run:android
  5- em novo terminal abrir o app com o deeplink: npx uri-scheme open igniteshoes://192.168.101.239:8081 --android (forma de abrir em desenv)
*/

/*
  -- Configuração da navegação com deeplink:
  1- adicionar o objeto linking criado abaixo à prop de mesmo nome do NavigationContainer
  2- usar o deeplink com npx uri-scheme open igniteshoes://details/7 --android - abre a tela de detalhes do produto com id 7
  3- no oneSignal adicionar igniteshoes://details/7 em launch url para abrir clicando na notificação
*/

const linking = {
  prefixes: ["igniteshoes://", "com.mairacosta.igniteshoes://", "exp+igniteshoes://" ], // verificar com npx uri-scheme list
  config: {
    screens: {
      details: {
        path: "/details/:productId",
        parse: {
          productId: (productId: string) => productId,
        }
      }
    }
  }
}




export function Routes() {
  const [notification, setNotification] = useState<OSNotification>()
  const { colors } = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  useEffect(() => {
    // Controle das notificações

    const handleNotification = (event: NotificationWillDisplayEvent): void => {
      event.preventDefault()
      const response = event.getNotification()
      setNotification(response)
    }
     
    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      handleNotification
    )

    return () =>
      OneSignal.Notifications.removeEventListener(
        "foregroundWillDisplay",
        handleNotification
      )

  })

  return (
    <NavigationContainer theme={theme} linking={linking}>
      <AppRoutes />
      {
        notification?.title && <Notification data={notification} onClose={() => setNotification(undefined)} />
      
      }
    </NavigationContainer>
  );
}