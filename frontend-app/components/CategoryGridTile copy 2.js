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
    <View style={styles.gridItem}>
      <TouchableComp style={{ flex: 1 }} onPress={props.onSelect}>
        <View
          style={{ ...styles.container, ...{ backgroundColor: "#f5a442" } }}
        >
          <Text style={styles.title} numberOfLines={2}>
            {props.title}
          </Text>
          <Text></Text>
        </View>
      </TouchableComp>
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    marginHorizontal: 15  ,
    marginVertical: 8,
    height: 100,
    borderRadius: 10,
    overflow:
      Platform.OS === "android" && Platform.Version >= 21
        ? "hidden"
        : "visible",
    elevation: 10,
  },
  container: {
    flex: 1,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,

    padding: 15,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
    textAlign: "left",
  },
});

export default CategoryGridTile;
