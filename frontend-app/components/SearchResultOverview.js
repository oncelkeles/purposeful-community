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
import { CheckBox } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useSelector, useDispatch } from "react-redux";

import onGetUserName from "../apiService/getUserName";

const PostOverview = (props) => {
  //const { post } = props;
  const post = props.post.post._doc;
  const [userName, setUserName] = useState("");

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  useEffect(() => {
    let id;
    if (post) {
      const values = Object.values(post.creator);
      id = values[1];
    }


    async function fetchUserName(id) {
      try {
        const res = await onGetUserName(id);
        setUserName(res);
        //cconsole.log(res);
      } catch (err) {
        console.log(err);
        message.error(
          "Could not fetch post types! Please try reloading the page."
        );
      }
    }
    if (post) {
      fetchUserName(id);
    }
  }, [post]);
  //console.log("HEYY",props.post.post._doc)
  let tags = "";
  post.tags.map((item, index) => {
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
          <Text style={styles.titleText}>{post.title}</Text>
         {/*  <View style={{ height: 10 }} />
          <Text style={styles.descriptionText}>{post.description}</Text> */}
        </View>
        {/* <View style={styles.infoView}>
          <View>
            <Text style={styles.createInfoText}>{userName + ", " +moment(post.updatedAt).format("D MMM YY")}</Text>
          </View>
        </View> */}
      </View>
    </TouchableComp>
  );
};

const styles = StyleSheet.create({
  overviewBox: {
    maxWidth: "90%",
    width: 450,
    backgroundColor: "#fff",
    height: 40,
    marginBottom: 5,
    marginTop: 5,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    overflow: "hidden",
  },
  titleView: {
    minHeight: "70%",
    width: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  infoView: {
    flexDirection: "row",
    height: "30%",
    width: "100%",
    justifyContent: "flex-end",
    paddingHorizontal: 5,
    alignItems: "flex-end"
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
    fontSize: 12,
  },
  createDateText: {
    fontSize: 10,
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

export default PostOverview;
