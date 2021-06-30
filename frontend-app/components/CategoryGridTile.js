import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
} from "react-native";

const CategoryGridTile = (props) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <TouchableComp style={{ flex: 1 }} onPress={props.onSelect}>
      <View style={styles.gridItem}>
        <View style={{ ...styles.container }}>
          <Text style={styles.title} numberOfLines={2}>
            {props.title}
          </Text>
          <Text></Text>
        </View>
      </View>
    </TouchableComp>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 8,
    height: 40,
    width: 150,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    overflow:
      Platform.OS === "android" && Platform.Version >= 21
        ? "hidden"
        : "visible",
  },
  container: {
    flex: 1,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.6,
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 10,
    marginTop: 15,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
    textAlign: "left",
  },
});

export default CategoryGridTile;
