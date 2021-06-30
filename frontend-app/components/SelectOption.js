import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const SelectOption = (props) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.optionControl}>
      <Text style={{ flex: 2 }}>Option: </Text>
      <TextInput
        style={{ ...styles.input, flex: 3 }}
        //onChangeText={(text) => props.onInputChangeHandler(text, "field", index)}
      />
      <View style={{ flex: 1 }} />

      <View style={styles.addOptionView}>
        {/* <TouchableComp
          onPress={() => {
            console.log("hey");
          }}
        >
          <AntDesign name="pluscircleo" size={24} color="black" />
        </TouchableComp> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  optionControl: {
    width: "100%",
    height: 30,
    flexDirection: "row",
  },
  addOptionView: {
    borderRadius: 15,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});

export default SelectOption;
