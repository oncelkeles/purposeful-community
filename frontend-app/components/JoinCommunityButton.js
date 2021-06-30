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
import { MaterialCommunityIcons } from "@expo/vector-icons";

const JoinCommunityButton = (props) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <View
      style={
        !props.invitationExists
          ? styles.roundButton
          : { ...styles.roundButton, backgroundColor: "#bfbfbf" }
      }
    >
      <MaterialCommunityIcons
        name={props.invitationExists ? "timer-sand" : "google-circles-group"}
        size={props.isCommunity ? 36 : 24}
        color={props.invitationExists ? "white" : "black"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  buttonView: {
    flex: 1,
    position: "absolute",
    right: 0,
    bottom: 0,
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
    backgroundColor: "#a0d911",
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

export default JoinCommunityButton;
