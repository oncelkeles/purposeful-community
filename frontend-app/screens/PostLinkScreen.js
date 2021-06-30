import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TouchableNativeFeedback,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import moment from "moment";
import { CheckBox } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useSelector, useDispatch } from "react-redux";

import onGetOnePost from "../apiService/getOnePost";
import onGetUserName from "../apiService/getUserName";

const PostLinkScreen = (props) => {
  const navigateHandler = (category, id, title, post) => {
    props.navigation.navigate({
      routeName: category,
      params: {
        id,
        title,
        post: { item: post },
        communityId: props.navigation.state.params.communityId,
      },
    });
  };

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  const { navigation } = props;
  //const post = navigation.state.params.post;
  const [post, setPost] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPost, setModalPost] = useState({});

  useEffect(() => {
    setPost(props.navigation.state.params.post);
  }, [props.navigation]);

  const onDataTypeClickHandler = async (id, title) => {
    await onGetOnePost(props.navigation.state.params.communityId, id)
      .then((res) => {
        const post = res;
        setModalVisible(true);
        setModalPost(post);
        //navigateHandler("Post", id, title, res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let tags = [];
  let postFields;
  if (post && post.tags && post.tags.length > 0) {
    post.tags.map((item, index) => {
      tags = "#" + item;
    });
    if(tags === "#") tags = "";

    postFields = post.postFields.map((item, index) => {
      if (
        item.dataType === "Text" ||
        item.dataType === "Number" ||
        item.dataType === "Select"
      ) {
        return (
          <View style={styles.attibuteBox} key={index}>
            <Text style={styles.labelText}>{item.label}: </Text>
            <Text style={styles.valueText}>{item.value}</Text>
          </View>
        );
      } else if (item.dataType === "Date") {
        return (
          <View style={styles.attibuteBox} key={index}>
            <Text style={styles.labelText}>{item.label}: </Text>
            <Text style={styles.valueText}>
              {moment(item.value).format("D MMM YY")}
            </Text>
          </View>
        );
      } else if (item.dataType === "Geolocation") {
        return (
          <View style={styles.attibuteBox} key={index}>
            <Text style={styles.labelText}>{item.label}: </Text>
            <View style={styles.locationBox}>
              <Text style={styles.valueText}>Latitude: {item.value.lat}</Text>
              <Text style={styles.valueText}>Longitude: {item.value.long}</Text>
            </View>
          </View>
        );
      } else if (item.dataType === "Checkbox") {
        return (
          <View style={styles.attibuteBox} key={index}>
            <View style={styles.checkboxContainer}>
              <Text style={styles.labelText}>{item.label}: </Text>
              <CheckBox checked={item.value} />
            </View>
          </View>
        );
      } else if (
        typeof item.dataType === "object" &&
        item.dataType.value === "DataType"
      ) {
        return (
          <View style={styles.attibuteBox} key={index}>
            <Text style={styles.labelText}>{item.label}: </Text>
            <TouchableComp
              onPress={() =>
                onDataTypeClickHandler(item.value.id, item.value.label)
              }
            >
              <Text style={styles.valueTextLink}>{item.value.label}</Text>
            </TouchableComp>
          </View>
        );
      }
    });
  }

  return (
    <ScrollView>
      <View style={styles.screen}>
        <View style={styles.attibuteBox}>
          <Text style={styles.labelText}>Title: </Text>
          <Text style={styles.valueText}>{post.title}</Text>
        </View>
        <View style={styles.attibuteBox}>
          <Text style={styles.labelText}>Description: </Text>
          <Text style={styles.valueText}>{post.description}</Text>
        </View>
        <View style={styles.attibuteBox}>
          <Text style={styles.labelText}>Tags: </Text>
          <Text style={styles.valueText}>{tags}</Text>
        </View>
        {postFields}
        {/* <Picker
          selectedValue={postType}
          onValueChange={(itemValue, itemIndex) =>
            onDropdownChangeHandler(itemValue, itemIndex)
          }
        >
          {availablePostTypes.map((item, index) => {
            return (
              <Picker.Item label={item.title} value={item.title} key={index} />
            );
          })}
        </Picker> */}
        <View style={{ height: 20 }} />
      </View>
    </ScrollView>
  );
};

PostLinkScreen.navigationOptions = (navigationData) => {
  const postTitle = navigationData.navigation.getParam("title");
  return {
    headerTitle: postTitle,
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
  },
  attibuteBox: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  labelText: {
    fontSize: 13,
  },
  valueText: {
    fontSize: 16,
    flex: 1
  },
  valueTextLink: {
    fontSize: 16,
    color: "#3399ff",
    textDecorationLine: "underline",
  },
  locationBox: {
    flexDirection: "row",
    width: "70%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  //modal styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default PostLinkScreen;
