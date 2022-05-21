import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Magic } from "@magic-sdk/react-native";
import { ethers } from "ethers";
import {
  Headline,
  Provider as PaperProvider,
  Surface,
  TextInput,
  Button,
} from "react-native-paper";

export default function App() {
  const m = new Magic("pk_live_3C2AC4811AF4E6F5"); // ✨
  const [email, setEmail] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState("not yet set");
  const [ethersInstance, setEthersInstance] = React.useState(null);
  const [signedMessage, setSignedMessage] = React.useState(null);
  const trigger = async () => {
    let isLogged = await m.user.isLoggedIn();
    console.log(isLogged)
    if (!isLogged) {
      await m.auth.loginWithMagicLink({ email });
      setUserData(JSON.stringify(await m.user.getMetadata()));
      setIsLoggedIn(true);
      setEthersInstance(new ethers.providers.Web3Provider(m.rpcProvider));
    } else {
      console.log(await m.user.getMetadata());
    }
  };
  const logout = async () => {
    await m.user.logout();
    console.log("logger out");
    setEthersInstance(null);
    setSignedMessage(null);
    setIsLoggedIn(false);
    setUserData(null);
  };
  const sign = async () => {
    console.log("called sign");
    setSignedMessage(null);
    const data = await ethersInstance.getSigner().signMessage("hello");
    setSignedMessage(data)
  };
  React.useEffect(() => {
    console.log("called");
    const init = async () => {
      let isLogged = await m.user.isLoggedIn();
      setSignedMessage(null);
      if (isLogged) {
        setUserData(JSON.stringify(await m.user.getMetadata()));
        setIsLoggedIn(true);
        setEthersInstance(new ethers.providers.Web3Provider(m.rpcProvider));
      } else {
        setUserData("user is not logged in ");
      }
    };
    init();
  }, []);
  return (
    <PaperProvider style={styles.container}>
      <m.Relayer />
      <Headline style={styles.head}>Sample Magic App</Headline>

      {isLoggedIn ? (
        <View>
          <Text style={styles.h}>{userData}</Text>
          <Button
            icon="launch"
            style={styles.h}
            mode="contained"
            onPress={logout}
          >
            logout
          </Button>
          <Button
            icon="launch"
            style={styles.h}
            mode="contained"
            onPress={sign}
          >
            Sign a message
          </Button>
          {signedMessage ? (
              <Text style={styles.h}>{signedMessage}</Text>
          ):(<></>)}
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.h}
            mode="Email"
            label="Email"
            placeholder="abc@gmail.com"
            onChangeText={(text) => setEmail(text)}
          />
          <Button
            icon="launch"
            style={styles.h}
            mode="contained"
            onPress={trigger}
          >
            Signing With Magic
          </Button>
        </View>
      )}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  head: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  h: {
    margin: 40,
  },
  container: {
    flex: 2,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  surface: {
    color: "white",
    backgroundColor: "#202124",
    padding: 20,
    height: `100vh`,
    width: `100vw`,
    alignItems: "center",
    justifyContent: "center",
    elevation: 12,
  },
});
