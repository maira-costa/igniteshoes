import { OneSignal } from "react-native-onesignal";

// Adiciona a tag do usuário ao OneSignal
export function tagUserInfoCreate() {
    OneSignal.User.addTags({
        user_name: "Maíra",
        use_email: "email@email.com"
         
    });
}