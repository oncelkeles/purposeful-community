import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const InviteButton = (props) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.roundButton}>
      <AntDesign
        name="adduser"
        size={props.isCommunity ? 36 : 24}
        color="black"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  buttonView: {
    flex: 1,
    position: "absolute",
    left: 0,
    bottom: 50,
    marginBottom: 20,
    width: 60,
    height: 60,
  },
  roundButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
    backgroundColor: "#91d5ff",
  },
  button2: {
    margin: 10,
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainerMiddle: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default InviteButton;
