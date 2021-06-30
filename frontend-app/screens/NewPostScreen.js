import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
} from "react-native";
import { LinearProgress } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";

import services from "../apiService/services";
import onLogin from "../apiService/login";
import onGetPostTypes from "../apiService/getPostTypes";
import postTypeInterface from "../models/postType";
import { POST_TYPES } from "../data/data";
import CustomHeaderButton from "../components/HeaderButton";
import CategoryGridTile from "../components/CategoryGridTile";
import PostType from "../models/postType";

/// NewPostScreen
const NewPostScreen = (props) => {
  const [mounted, setMounted] = useState(false);
  const [postTypes, setPostTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      // Fetch profile data
      setMounted(true);
    });

    return () => {
      unsubscribe;
    };
  }, [props.navigation]);

  useEffect(() => {
    async function fetchPostTypes() {
      try {
        const types = await onGetPostTypes(
          props.navigation.state.params.communityId
        );
        setPostTypes(types);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        message.error(
          "Could not fetch post types! Please try reloading the page."
        );
      }
    }

    if (mounted) {
      fetchPostTypes();
      setMounted(false);
    }
    return () => {
      console.log("CLEAN UP");
    };
  }, [mounted]);

  const navigateHandler = (category, id, title, itemData) => {
    props.navigation.navigate({
      routeName: category,
      params: {
        postTypeId: id,
        title,
        postTypes: postTypes,
        communityId: props.navigation.state.params.communityId,
        isHiddenFromFeed: !props.navigation.state.params.community.isPublic
      },
    });
  };



  const renderGridItem = (itemData) => {
    if (!itemData.item.isHidden) {
      return (
        <CategoryGridTile
          title={itemData.item.title}
          color={itemData.item.color}
          onSelect={() => {
            navigateHandler(
              "PostForm",
              itemData.item._id,
              itemData.item.title,
              itemData
            );
          }}
        />
      );
    }
  };

  return (
    <>
      {loading ? (
        <View style={styles.loadingScreen}>
          <LinearProgress color="primary" />
        </View>
      ) : (
        <View style={styles.screen}>
          <View style={{ height: 10 }} />

          <FlatList
            /* keyExtractor={(item, index) => item.id} */
            data={postTypes}
            renderItem={renderGridItem}
            numColumns={1}
            key={"_"}
          />
          {props.navigation.state.params.restrictionStatus > 2 ? (
            <TouchableComp
              onPress={() => {
                navigateHandler(
                  "PostTypeForm",
                  "0",
                  "New Post Type",
                  postTypes
                );
              }}
            >
              <View style={styles.container}>
                <Text style={styles.textCreate}>Create New Post Type</Text>
              </View>
            </TouchableComp>
          ) : null}

          {/* <TouchableComp
            onPress={() => {
              onLogin();
            }}
          >
            <View style={styles.container}>
              <Text style={styles.textCreate}>LOGIN</Text>
            </View>
          </TouchableComp> */}
        </View>
      )}
    </>
  );
};

NewPostScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Create New Post",
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
    justifyContent: "center",
    alignItems: "flex-start",
  },
  addGrid: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 8,
    height: 90,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "white",
    overflow:
      Platform.OS === "android" && Platform.Version >= 21
        ? "hidden"
        : "visible",
  },
  container: {
    marginLeft: 15,
  },
  textCreate: {
    textDecorationLine: "underline",
  },
});

export default NewPostScreen;
