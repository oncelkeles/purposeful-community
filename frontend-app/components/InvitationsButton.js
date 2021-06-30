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

const InvitationsButton = (props) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <View>
      {props.invitations > 0 ? (
        <View style={styles.notificationView}>
          <Text style={{ color: "white" }}>{props.invitations}</Text>
        </View>
      ) : null}

      <View style={styles.roundButton}>
        <MaterialCommunityIcons name="inbox-multiple" size={18} color="black" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  buttonView: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 50,
    marginBottom: 20,
    width: 60,
    height: 60,
  },
  notificationView: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    borderRadius: 100,
    backgroundColor: "red",
  },
  roundButton: {
    width: 40,
    height: 40,
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

export default InvitationsButton;
