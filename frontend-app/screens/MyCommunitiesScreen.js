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
import { LinearProgress } from "react-native-elements";

import AddButton from "../components/AddButton";
import onLogin from "../apiService/login";
import onGetPosts from "../apiService/getPosts";
import onGetMyCommunities from "../apiService/getMyCommunities";
import CommunityOverview from "../components/CommunityOverview";
import CustomHeaderButton from "../components/HeaderButton";
import { Button } from "react-native-elements";

/// CommunityScreen
const MyCommunitiesScreen = (props) => {
  const [communities, setCommunities] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      // Fetch profile data
      console.log("m-MOUNTED");
      setMounted(true);
    });

    return () => {
      unsubscribe;
    };
  }, [props.navigation]);

  useEffect(() => {
    async function fetchMyCommunities() {
      try {
        const res = await onGetMyCommunities();
        setCommunities(res);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        message.error(
          "Could not fetch post types! Please try reloading the page."
        );
      }
    }

    fetchMyCommunities();
  }, []);

  useEffect(() => {
    async function fetchMyCommunities() {
      try {
        const res = await onGetMyCommunities();
        setCommunities(res);
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
      fetchMyCommunities();
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
        id,
        title,
        post: itemData,
      },
    });
  };


  const renderGridItem = (itemData) => {
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
        isMine={true}
      />
    );
  };

  return (
    <View style={styles.screen}>
      {loading ? (
        <LinearProgress color="primary" />
      ) : (
        <>
          <View style={{ height: 10 }} />

          <FlatList
            /* keyExtractor={(item, index) => item.id} */
            style={{ width: "100%" }}
            contentContainerStyle={styles.listScreen}
            data={communities}
            renderItem={renderGridItem}
            numColumns={1}
            key={"_"}
          />
          <View style={{ height: 60 }} />
        </>
      )}
    </View>
  );
};

MyCommunitiesScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "My Communities",
    /* headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName="menu-fold"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ), */
  };
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    flex: 1,
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

export default MyCommunitiesScreen;
