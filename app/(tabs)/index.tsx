import { Button, Platform, SafeAreaView, StatusBar } from "react-native";
import { useNotification } from "@/context/NotificationContext";
import { Text, View } from "@/components/Themed";


export default function HomeScreen() {
  const { notification, expoPushToken, error } = useNotification();

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  async function sendPushNotification(expoPushToken: string) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      // sound: 'sonar_w.wav', // <- for custom sound (neither default nor custom sound works on iOS)
      title: 'Sound does not work on iOS',
      body: 'I hope we can fix it.',
      data: { expo: 'Thank you for addressing this problem.' },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }


  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 10,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={{ color: "red" }}>
          Your push token:
        </Text>
        <Text>{expoPushToken}</Text>
        <Text>Latest notification:</Text>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>

        <Button
          title="Press to Send Notification"
          onPress={async () => {
            if (expoPushToken) {
              await sendPushNotification(expoPushToken);
            } else {
              alert("Expo Push Token is not available");
            }
          }}
        />
      </SafeAreaView>
    </View>
  );
}
