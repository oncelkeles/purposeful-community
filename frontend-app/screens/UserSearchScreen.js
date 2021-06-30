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
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import { SearchBar } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AddButton from "../components/AddButton";
import onLogin from "../apiService/login";
import onSearchUsers from "../apiService/searchUsers";
import onGetAllPosts from "../apiService/getAllPosts";
import onSearchCommunities from "../apiService/searchCommunities";
import onSendInvitation from "../apiService/sendInvitation";
import UserOverview from "../components/UserOverview";
import CustomHeaderButton from "../components/HeaderButton";
import { LinearProgress } from "react-native-elements";

const UserSearchScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTab, setSearchTab] = useState("posts");
  const [searchString, setSearchString] = useState("");

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  /* useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await onGetPosts("60be2f36b9901705f47a09ac");
        setPosts(res);
      } catch (err) {
        console.log(err);
        message.error(
          "Could not fetch post types! Please try reloading the page."
        );
      }
    }
    fetchPosts();
    
    return () => {
      console.log("CLEAN UP");
    };
  }, []); */

  const onSendInvite = async (user) => {
    let reqBody = {};
    reqBody = {
      from: {
        community: props.navigation.state.params.communityId,
      },
      to: {
        user: user._id,
      },
      status: 1,
    };
    await onSendInvitation(reqBody);
  };

  const searchUsers = async (name) => {
    await onSearchUsers(name)
      .then((res) => {
        setSearchResults(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const navigateHandler = (category, id, title, itemData) => {
    if (searchTab === "post") {
    }
    props.navigation.navigate({
      routeName: category,
      params: {
        id,
        title,
        post: itemData,
      },
    });
  };

  const onUpdateSearch = (name) => {
    setSearchString(name);
    searchUsers(name);
  };

  //const dispatch = useDispatch();
  const availablePostTypes = useSelector((state) => state.postTypes.postTypes);
  //console.log(availablePostTypes);

  const renderGridItem = (itemData) => {
    return (
      <UserOverview
        user={itemData.item}
        communityId={props.navigation.state.params.communityId}
        color={itemData.item.color}
        onSelect={() => {
          onSendInvite(itemData.item);
          /* navigateHandler(
            "Post",
            itemData.item._id,
            itemData.item.title,
            itemData
          ); */
        }}
      />
    );
  };


  return (
    <View style={styles.screen}>
      <View style={{ height: 10 }} />

      <View style={styles.searchView}>
        <SearchBar
          placeholder="Search..."
          onChangeText={onUpdateSearch}
          value={searchString}
          style={{ height: 30, backgroundColor: "white" }}
          inputStyle={{ backgroundColor: "white" }}
          containerStyle={{
            backgroundColor: "white",
            borderWidth: 1,
            borderRadius: 5,
          }}
          inputContainerStyle={{
            backgroundColor: "white",
            height: 30,
            width: "80%",
          }}
        />
      </View>
      <View style={{ height: 10 }} />
      <FlatList
        /* keyExtractor={(item, index) => item.id} */
        style={{ width: "100%" }}
        contentContainerStyle={styles.listScreen}
        data={searchResults}
        renderItem={renderGridItem}
        numColumns={1}
        key={"_"}
      />

      <View style={{ height: 60 }} />

      {/* <TouchableComp
        onPress={() => {
          navigateHandler("PostTypeForm", "0", "New Post Type");
        }}
      >
        <View style={styles.container}>
          <Text style={styles.textCreate}>Create New Post Type</Text>
        </View>
      </TouchableComp> */}

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
  );
};

UserSearchScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "User Search",
  };
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    flex: 1,
  },
  searchTypeTab: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  searchTab: {
    fontSize: 13,
    color: "black",
  },
  activeSearchTab: {
    textDecorationLine: "underline",
    color: "#3399ff",
    fontSize: 16,
  },
  searchView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  listScreen: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTopView: {
    flex: 1,
    position: "absolute",
    right: 0,
    bottom: 0,
    marginBottom: 10,
    width: 60,
    height: 60,
    overflow: "hidden",
    borderRadius: 100,
  },
  buttonView: {
    flex: 1,
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 60,
    height: 60,
    overflow: "hidden",
    borderRadius: 100,
    marginBottom: 10,
  },
  container: {
    marginLeft: 15,
  },
  textCreate: {
    textDecorationLine: "underline",
  },
});

export default UserSearchScreen;
