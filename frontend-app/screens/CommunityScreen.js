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

import JoinCommunityButton from "../components/JoinCommunityButton";
import AddButton from "../components/AddButton";
import InviteButton from "../components/InviteButton";
import onGetMe from "../apiService/getMe";
import onGetPosts from "../apiService/getPosts";
import PostOverview from "../components/PostOverview";
import onJoinCommunity from "../apiService/joinCommunity";
import InvitationsButton from "../components/InvitationsButton";

/// CommunityScreen
const CommunityScreen = (props) => {
  const [posts, setPosts] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState({});
  const [currentCommunityId, setCurrentCommunityId] = useState(null);
  const [invitationExists, setInvitationExists] = useState(false);
  const [joinedCommunity, setJoinedCommunity] = useState(false);
  // 3: master, 2: member, 1: public, 0: no access
  const [restrictionStatus, setRestrictionStatus] = useState(0);
  const [invitationNumber, setInvitationNumber] = useState(0);
  const [joinRequests, setJoinRequests] = useState([]);

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
    async function fetchPosts() {
      try {
        const res = await onGetPosts(props.navigation.state.params.id);
        setPosts(res);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        message.error(
          "Could not fetch post types! Please try reloading the page."
        );
      }
    }
    async function fetchMe() {
      try {
        const res = await onGetMe();
        setMe(res);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        message.error("Could not fetch user!");
      }
    }

    if (mounted) {
      fetchMe();
      fetchPosts();
      setMounted(false);
    }

    return () => {
      console.log("CLEAN UP");
    };
  }, [mounted]);

  // check restrction
  useEffect(() => {
    if (!joinedCommunity) {
      if (
        props.navigation.state.params.post &&
        props.navigation.state.params.post.item
      ) {
        const currentCommunity = props.navigation.state.params.post.item;
        setCurrentCommunityId(currentCommunity._id);
        if (currentCommunity.creator.id === me._id) {
          setRestrictionStatus(3);
          setInvitationNumber(currentCommunity.joinRequests.length);
          setJoinRequests([...currentCommunity.joinRequests]);
        } else if (currentCommunity.organizers.some((p) => p.id === me._id)) {
          setRestrictionStatus(3);
          setInvitationNumber(currentCommunity.joinRequests.length);
          setJoinRequests([...currentCommunity.joinRequests]);
        } else if (currentCommunity.members.some((p) => p === me._id)) {
          setRestrictionStatus(2);
        } else if (currentCommunity.isPublic) {
          setRestrictionStatus(1);
        } else {
          setRestrictionStatus(0);
          if (currentCommunity.joinRequests.some((p) => p.user === me._id)) {
            setInvitationExists(true);
          }
        }
      } else if (props.navigation.state.params.community) {
        const currentCommunity = props.navigation.state.params.community;
        setCurrentCommunityId(currentCommunity._id);
        if (currentCommunity.creator.id === me._id) {
          setRestrictionStatus(3);
          setInvitationNumber(currentCommunity.joinRequests.length);
          setJoinRequests([...currentCommunity.joinRequests]);
        } else if (currentCommunity.organizers.some((p) => p.id === me._id)) {
          setRestrictionStatus(3);
          setInvitationNumber(currentCommunity.joinRequests.length);
          setJoinRequests([...currentCommunity.joinRequests]);
        } else if (currentCommunity.members.some((p) => p === me._id)) {
          setRestrictionStatus(2);
        } else if (currentCommunity.isPublic) {
          setRestrictionStatus(1);
        } else {
          setRestrictionStatus(0);
          if (currentCommunity.joinRequests.some((p) => p.user === me._id)) {
            setInvitationExists(true);
          }
        }
      }
    }
  }, [props.navigation, me]);

  const navigateHandler = (category, id, title, itemData) => {
    props.navigation.navigate({
      routeName: category,
      params: {
        id,
        title,
        post: itemData,
        communityId: props.navigation.state.params.id,
        community: props.navigation.state.params.post,
        invitations: joinRequests,
        restrictionStatus: restrictionStatus,
      },
    });
  };

  //const dispatch = useDispatch();
  const availablePostTypes = useSelector((state) => state.postTypes.postTypes);
  

  const renderGridItem = (itemData) => {
    if (!itemData.item.isHidden) {
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

  const joinCommunityHandler = async () => {
    const result = await onJoinCommunity(currentCommunityId);
    if (result.joinSuccess) {
      setMounted(true);
      setRestrictionStatus(2);
      setJoinedCommunity({ ...result.community });
    } else {
      setInvitationExists(true);
    }
  };

  return (
    <View style={styles.screen}>
      {loading ? (
        <LinearProgress color="primary" />
      ) : (
        <>
          <View style={{ height: 10 }} />
          <View style={styles.topBar}>
            {restrictionStatus >= 2 ? (
              <TouchableComp
                style={{
                  flex: 1,
                  overflow: "hidden",
                  borderRadius: 100,
                }}
                onPress={() => {
                  navigateHandler("SearchPostTypes", 1);
                }}
              >
                <Text style={styles.searchText}>Search</Text>
                {/* <View style={styles.topLeftButtonView}>
                  <InvitationsButton invitations={invitationNumber} />
                </View> */}
              </TouchableComp>
            ) : null}

            {restrictionStatus === 3 ? (
              <TouchableComp
                style={{
                  flex: 1,
                  overflow: "hidden",
                  borderRadius: 100,
                }}
                onPress={() => {
                  navigateHandler(
                    "CommunityInvitations",
                    "0",
                    props.navigation.state.params.title
                  );
                }}
              >
                <View style={styles.topLeftButtonView}>
                  <InvitationsButton invitations={invitationNumber} />
                </View>
              </TouchableComp>
            ) : null}
          </View>
          <View style={{ height: 30 }} />
          {/* {restrictionStatus === 3 ? <View style={{ height: 30 }} /> : null} */}
          {restrictionStatus === 0 ? (
            <View>
              <Text>You cannot see this community, please join first.</Text>
              <View style={{ height: 10 }} />
              {invitationExists ? (
                <Text style={{ fontSize: 18 }}>
                  You already sent a join request!
                </Text>
              ) : null}
            </View>
          ) : posts && posts.length > 0 ? (
            <FlatList
              /* keyExtractor={(item, index) => item.id} */
              style={{ width: "100%" }}
              contentContainerStyle={styles.listScreen}
              data={posts}
              renderItem={renderGridItem}
              numColumns={1}
              key={"_"}
            />
          ) : (
            <View style={styles.noPostContainer}>
              <Text style={{ fontSize: 20 }}>No posts yet!</Text>
            </View>
          )}
          <View style={{ height: 60 }} />
          {restrictionStatus === 3 ? (
            <TouchableComp
              style={{
                flex: 1,
                overflow: "hidden",
                borderRadius: 100,
              }}
              onPress={() => {
                navigateHandler("UserSearch", "0", "New Post");
              }}
            >
              <View style={styles.leftButtonView}>
                <InviteButton />
              </View>
            </TouchableComp>
          ) : null}

          {restrictionStatus === 2 || restrictionStatus === 3 ? (
            <TouchableComp
              style={{
                flex: 1,
                overflow: "hidden",
                borderRadius: 100,
              }}
              onPress={() => {
                navigateHandler("NewPost", "0", "New Post");
              }}
            >
              <View style={styles.buttonView}>
                <AddButton />
              </View>
            </TouchableComp>
          ) : (
            <TouchableComp
              style={{
                flex: 1,
                overflow: "hidden",
                borderRadius: 100,
              }}
              onPress={
                !invitationExists
                  ? () => {
                      joinCommunityHandler();
                    }
                  : null
              }
            >
              <View style={styles.buttonView}>
                <JoinCommunityButton invitationExists={invitationExists} />
              </View>
            </TouchableComp>
          )}
        </>
      )}
    </View>
  );
};

CommunityScreen.navigationOptions = (navigationData) => {
  const communityName = navigationData.navigation.getParam("title");
  return {
    headerTitle: communityName,
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
  searchText: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 10,
  },
  invitationsView: {
    width: "100%",
    top: 0,
  },
  listScreen: {
    justifyContent: "center",
    alignItems: "center",
  },
  topLeftButtonView: {
    flex: 1,
    position: "absolute",
    right: 0,
    top: -10,
    marginBottom: 10,
    width: 60,
    height: 60,
    overflow: "hidden",
    borderRadius: 100,
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
  leftButtonView: {
    flex: 1,
    position: "absolute",
    left: 0,
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
  noPostContainer: {
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CommunityScreen;
