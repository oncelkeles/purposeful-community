import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Button,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { LinearProgress } from "react-native-elements";

import onAcceptJoinRequest from "../apiService/acceptJoinRequest";
import onRejectJoinRequest from "../apiService/rejectJoinRequest";
import JoinRequestOverview from "../components/JoinRequestOverview";
import onGetMe from "../apiService/getMe";

const CommunityInvitationsScreen = (props) => {
  const navigateHandler = (category, id) => {
    props.navigation.navigate({
      routeName: category,
      params: {
        categoryId: id,
      },
    });
  };

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [invitations, setInvitations] = useState([]);
  const [me, setMe] = useState({});

  // ilk renderda çalışır
  useEffect(() => {
    setMounted(true);
  }, []);

  // her bu sayfaya ilk navigta ettiğinde çalışır,
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

  // burada get my invitations atabilirsin
  useEffect(() => {
    if (mounted) {
      setMe({ ...props.navigation.state.params.community });
      setInvitations(props.navigation.state.params.invitations);
      setLoading(false);
      setMounted(false);
    }

    return () => {
      console.log("CLEAN UP");
    };
  }, [mounted]);

  const renderGridItem = (itemData) => {
    return (
      <JoinRequestOverview
        invitation={itemData.item}
        color={itemData.item.color}
        onAccept={() => acceptJoinRequestHandler(itemData.item)}
        onReject={() => rejectJoinRequestHandler(itemData.item)}
      />
    );
  };

  const acceptJoinRequestHandler = async (joinRequest) => {

    const result = await onAcceptJoinRequest(
      props.navigation.state.params.communityId,
      { userId: joinRequest.user }
    );
    setInvitations([...result.joinRequests]);
  };

  const rejectJoinRequestHandler = async (joinRequest) => {
    const result = await onRejectJoinRequest(
      props.navigation.state.params.communityId,
      {
        userId: joinRequest.user,
      }
    );
    setInvitations([...result.joinRequests]);
  };

  // my communities screen incelenebiliri, orada da community overview çağrılıyor her biri içim
  return (
    <View style={styles.screen}>
      {loading ? (
        <LinearProgress color="primary" />
      ) : invitations && invitations.length > 0 ? (
        <>
          <FlatList
            /* keyExtractor={(item, index) => item.id} */
            style={{ width: "100%" }}
            contentContainerStyle={styles.listScreen}
            data={invitations}
            renderItem={renderGridItem}
            numColumns={1}
            key={"_"}
          />
          {/* <View style={{ height: 10 }} />
        
        <View style={{ height: 60 }} /> */}
        </>
      ) : (
        <View style={styles.noInvitationView}>
          <Text style={styles.noInvitationText}>No invitations pending</Text>
        </View>
      )}
    </View>
  );
};

CommunityInvitationsScreen.navigationOptions = (navigationData) => {
  const communityName = navigationData.navigation.getParam("title");
  return {
    headerTitle: communityName + " Invitations",
  };
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    flex: 1,
  },
  noInvitationText: {
    fontSize: 18,
  },
  noInvitationView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    top: "-40%",
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

export default CommunityInvitationsScreen;
