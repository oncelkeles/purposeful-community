import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import moment from "moment";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

import onGetUserName from "../apiService/getUserName";

const CommunityOverview = (props) => {
  const { community } = props;
  const [userName, setUserName] = useState("");

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  useEffect(() => {
    const values = Object.values(community.creator);
    const id = values[1];
    async function fetchUserName() {
      try {
        const res = await onGetUserName(id);
        setUserName(res);
        //cconsole.log(res);
      } catch (err) {
        console.log(err);
        message.error(
          "Could not fetch communities! Please try reloading the page."
        );
      }
    }
    fetchUserName();
  }, []);

  let tags = "";
  community.tags.map((item, index) => {
    tags = tags + "#" + item;
  });
  if(tags === "#") tags = "";

  return (
    <TouchableComp
      style={{
        flex: 1,
        overflow: "hidden",
        borderRadius: 100,
      }}
      onPress={() => {
        props.onSelect();
      }}
    >
      <View style={styles.overviewBox}>
        <View style={styles.titleView}>
          <View style={styles.infoOverview}>
            <Text style={styles.titleText}>{community.name}</Text>
            {!community.isPublic ? (
              props.isMine ? (
                <View style={styles.iconView}>
                  <FontAwesome name="unlock" size={24} color="black" />
                </View>
              ) : (
                <View style={styles.iconView}>
                  <FontAwesome name="lock" size={24} color="black" />
                </View>
              )
            ) : (
              <View style={styles.iconView}>
                <MaterialIcons name="public" size={24} color="black" />
              </View>
            )}
          </View>

          <View style={{ height: 10 }} />
          <Text style={styles.descriptionText}>{community.description}</Text>
        </View>
        <View style={styles.infoView}>
          <View>
            <Text style={styles.tagsText}>{tags}</Text>
          </View>
          <View>
            <Text style={styles.createInfoText}>{userName}</Text>
            <Text style={styles.createDateText}>
              {moment(community.createdAt).format("D MMM YY")}
            </Text>
          </View>
        </View>
        {/* <Text>{props.title}</Text> */}
      </View>
    </TouchableComp>
  );
};

const styles = StyleSheet.create({
  overviewBox: {
    maxWidth: "90%",
    width: 450,
    backgroundColor: "#BED7FF",
    height: 150,
    marginBottom: 5,
    marginTop: 5,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    overflow: "hidden",
  },
  infoOverview: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  titleView: {
    height: "70%",
    width: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    paddingTop: 15,
  },
  infoView: {
    flexDirection: "row",
    height: "30%",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  iconView: {
    right: 0,
    paddingLeft: 10,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  tagsText: {
    fontStyle: "italic",
    fontSize: 12,
  },
  createInfoText: {
    fontSize: 14,
  },
  createDateText: {
    fontSize: 12,
  },
  descriptionText: {
    fontSize: 12,
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    margin: 20,
  },
  formControl: {
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
  },
  label: {
    marginVertical: 8,
  },
  selectBox: {
    width: 100,
    height: 100,
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 2,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  locationInput: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
});

export default CommunityOverview;
