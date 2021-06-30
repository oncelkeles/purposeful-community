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
  TextInput,
  Button,
} from "react-native";
import moment from "moment";
import { LinearProgress, CheckBox } from "react-native-elements";
/* import { CheckBox } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useSelector, useDispatch } from "react-redux"; */

import onGetOnePost from "../apiService/getOnePost";
import onGetUserName from "../apiService/getUserName";
import onGetMe from "../apiService/getMe";
import onUpdatePost from "../apiService/updatePost";

const PostScreen = (props) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [canEdit, setCanEdit] = useState(false);

  /*  const navigateHandler = (category, id, title, post) => {
    props.navigation.navigate({
      routeName: category,
      params: {
        id,
        title,
        post: { item: post },
        communityId: props.navigation.state.params.communityId,
      },
    });
  }; */

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
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      // Fetch profile data
      setMounted(true);
    });
    setPost(props.navigation.state.params.post.item);
    return () => {
      unsubscribe;
    };
  }, [props.navigation]);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await onGetMe();
        setUserId(res);
        setLoading(false);
        setCanEdit(res._id === post.creator.id);
      } catch (err) {
        console.log(err);
        setLoading(false);
        message.error(
          "Could not fetch post types! Please try reloading the page."
        );
      }
    }
    if (mounted) {
      fetchMe();
      setMounted(false);
    }

    return () => {
      console.log("CLEAN UP");
    };
  }, [mounted]);

  const onDataTypeClickHandler = async (id, title) => {
    await onGetOnePost(props.navigation.state.params.communityId, id)
      .then((res) => {
        const post = res;
        /*  setModalVisible(true);
        setModalPost(post); */
        navigateHandler("PostLink", id, title, post);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFieldInputChangeHandler = (e, index) => {
    let temp = [...post.postFields];
    temp[index].value = e;
    setPost({
      ...post,
      postFields: [...temp],
    });
  };

  const onFieldCheckboxChangeHandler = (index) => {
    let temp = [...post.postFields];
    temp[index].value = !temp[index].value;
    setPost({
      ...post,
      postFields: [...temp],
    });
  };

  const navigateHandler = (category, id, title, itemData) => {
    props.navigation.navigate({
      routeName: category,
      params: {
        id,
        title,
        post: itemData,
      },
    });
  };

  const onUpdatePostHandler = async () => {
    await onUpdatePost(post._id, post);
    navigateHandler(
      "Community",
      props.navigation.state.params.communityId,
      props.navigation.state.params.community.name,
      props.navigation.state.params.community
    );
  };

  let tags = [];
  let postFields;
  if (post) {
    post.tags.map((item, index) => {
      tags = "#" + item;
    });

    postFields = post.postFields.map((item, index) => {
      if (
        item.dataType === "Text" ||
        item.dataType === "Number" ||
        item.dataType === "Select"
      ) {
        return (
          <View style={styles.attibuteBox} key={index}>
            <Text style={styles.labelText}>{item.label}: </Text>
            {canEdit && item.isEditable ? (
              <TextInput
                style={styles.input}
                value={item.value}
                onChangeText={(e) => onFieldInputChangeHandler(e, index)}
                keyboardType="default"
              />
            ) : (
              <Text style={styles.valueText}>{item.value}</Text>
            )}
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
              <CheckBox
                checked={item.value}
                onPress={
                  canEdit && item.isEditable
                    ? () => onFieldCheckboxChangeHandler(index)
                    : null
                }
              />
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

  let modalTags = [];
  let modalPostFields;
  if (modalPost) {
    if (modalPost.tags) {
      modalPost.tags.map((item, index) => {
        modalTags = "#" + item;
      });
    }
    if (modalPost.postFields) {
      modalPostFields = modalPost.postFields.map((item, index) => {
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
                <Text style={styles.valueText}>
                  Longitude: {item.value.long}
                </Text>
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
              <Text style={styles.labelText}>{item.label + " "}: </Text>
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
  }

  let modalComp;
  modalComp = (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalPost.title}</Text>
            <ScrollView>
              <View style={styles.screen}>
                <View style={styles.attibuteBox}>
                  <Text style={styles.labelText}>Title: </Text>
                  <Text style={styles.valueText}>{modalPost.title}</Text>
                </View>
                <View style={styles.attibuteBox}>
                  <Text style={styles.labelText}>Description: </Text>
                  <Text style={styles.valueText}>{modalPost.description}</Text>
                </View>
                <View style={styles.attibuteBox}>
                  <Text style={styles.labelText}>Tags: </Text>
                  <Text style={styles.valueText}>{modalTags}</Text>
                </View>
                {modalPostFields}
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
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/*  <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable> */}
    </View>
  );

  //contentContainerStyle={styles.screen}
  return (
    <>
      {loading ? (
        <View style={styles.loadingScreen}>
          <LinearProgress color="primary" />
        </View>
      ) : (
        <View style={styles.screen}>
          <ScrollView>
            <View style={styles.screen}>
              <>
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
                {modalComp}
                <View style={{ height: 20 }} />
              </>
            </View>
          </ScrollView>
          {canEdit && (
            <View style={styles.buttonView}>
              <Button
                style={styles.updateButton}
                title="Update Post"
                onPress={onUpdatePostHandler}
              />
            </View>
          )}
        </View>
      )}
    </>
  );
};

PostScreen.navigationOptions = (navigationData) => {
  const postTitle = navigationData.navigation.getParam("title");
  return {
    headerTitle: postTitle,
  };
};

const styles = StyleSheet.create({
  loadingScreen: {
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    flex: 1,
  },
  screen: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    height: "100%",
  },
  attibuteBox: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  labelText: {
    fontSize: 13,
  },
  valueText: {
    fontSize: 16,
    flex: 1,
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
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  updateButton: {
    width: "100%",
  },
  buttonView: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    overflow: "hidden",
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
  },
});

export default PostScreen;
