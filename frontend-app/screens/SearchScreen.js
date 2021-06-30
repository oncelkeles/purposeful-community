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
import onGetPosts from "../apiService/getPosts";
import onGetAllPosts from "../apiService/getAllPosts";
import onSearchCommunities from "../apiService/searchCommunities";
import PostOverview from "../components/PostOverview";
import CommunityOverview from "../components/CommunityOverview";
import CustomHeaderButton from "../components/HeaderButton";
import { LinearProgress } from "react-native-elements";

/// CommunityScreen
const SearchScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [communityResults, setCommunityResults] = useState([]);
  const [searchTab, setSearchTab] = useState("posts");
  const [searchString, setSearchString] = useState("");

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@storage_Key", value);
    } catch (e) {
      // saving error
    }
  };

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

  const searchPosts = async (text) => {
    await onGetAllPosts(text)
      .then((res) => {
        setSearchResults(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchCommunities = async (text) => {
    await onSearchCommunities(text)
      .then((res) => {
        setCommunityResults(res);
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

  const onChangeTab = (section) => {
    setSearchTab(section);
    if (searchString !== "") {
      onUpdateSearch(searchString);
    }
  };

  const onUpdateSearch = (text) => {
    setSearchString(text);
    if (searchTab === "posts") {
      searchPosts(text);
    } else if (searchTab === "communities") {
      searchCommunities(text);
    }
  };

  //const dispatch = useDispatch();
  const availablePostTypes = useSelector((state) => state.postTypes.postTypes);
  //console.log(availablePostTypes);

  const renderGridItem = (itemData) => {
    if (!itemData.item.isHiddenFromFeed && !itemData.item.isHidden) {
      return (
        <PostOverview
          post={itemData.item}
          color={itemData.item.color}
          onSelect={() => {
            navigateHandler(
              "Post",
              itemData.item._id,
              itemData.item.title,
              itemData
            );
          }}
        />
      );
    }
  };

  const renderCommunityItem = (itemData) => {
    return (
      <CommunityOverview
        community={itemData.item}
        color={itemData.item.color}
        onSelect={() => {
          navigateHandler(
            "Community",
            itemData.item._id,
            itemData.item.name,
            itemData
          );
        }}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <View style={{ height: 10 }} />
      <View style={styles.searchTypeTab}>
        <TouchableComp
          onPress={() => {
            onChangeTab("posts");
          }}
        >
          <Text
            style={
              searchTab === "posts" ? styles.activeSearchTab : styles.searchTab
            }
          >
            Posts
          </Text>
        </TouchableComp>
        <TouchableComp
          onPress={() => {
            onChangeTab("communities");
          }}
        >
          <Text
            style={
              searchTab === "communities"
                ? styles.activeSearchTab
                : styles.searchTab
            }
          >
            Communities
          </Text>
        </TouchableComp>
      </View>
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
      {searchTab === "posts" ? (
        <FlatList
          /* keyExtractor={(item, index) => item.id} */
          style={{ width: "100%" }}
          contentContainerStyle={styles.listScreen}
          data={searchResults}
          renderItem={renderGridItem}
          numColumns={1}
          key={"_"}
        />
      ) : null}
      {searchTab === "communities" ? (
        <FlatList
          /* keyExtractor={(item, index) => item.id} */
          style={{ width: "100%" }}
          contentContainerStyle={styles.listScreen}
          data={communityResults}
          renderItem={renderCommunityItem}
          numColumns={1}
          key={"_"}
        />
      ) : null}

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

      {searchTab === "communities" ? (
        <TouchableComp
          style={{
            flex: 1,
            overflow: "hidden",
            borderRadius: 100,
          }}
          onPress={() => {
            navigateHandler("CommunityForm", "0", "New Post");
          }}
        >
          <View style={styles.buttonView}>
            <AddButton isCommunity={searchTab === "communities"} />
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
  );
};

SearchScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Community",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName="menu-fold"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
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

export default SearchScreen;
