import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Button,
  Platform,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { LinearProgress } from "react-native-elements";

import onRejectInvitation from "../apiService/rejectInvitation";
import onAcceptInvitation from "../apiService/acceptInvitation";
import onGetMyInvitations from "../apiService/getMyInvitations";
import InvitationOverview from "../components/InvitationOverview";
import onGetMe from "../apiService/getMe";
import onLogout from "../apiService/logout";

const ProfileScreen = (props) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

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
      setMounted(true);
    });

    return () => {
      unsubscribe;
    };
  }, [props.navigation]);

  // burada get my invitations atabilirsin
  useEffect(() => {
    async function fetchMyInvitations() {
      try {
        const res = await onGetMyInvitations();
        setInvitations(res);
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
        message.error(
          "Could not fetch post types! Please try reloading the page."
        );
      }
    }
    if (mounted) {
      fetchMyInvitations();
      fetchMe();
      setMounted(false);
    }

    return () => {
      console.log("CLEAN UP");
    };
  }, [mounted]);

  const renderGridItem = (itemData) => {
    return (
      <InvitationOverview
        invitation={itemData.item}
        color={itemData.item.color}
        onAccept={() => acceptInvitationHandler(itemData.item.invitationId)}
        onReject={() => rejectInvitationHandler(itemData.item.invitationId)}
      />
    );
  };

  const acceptInvitationHandler = async (invitationId) => {
    const res = await onAcceptInvitation(invitationId);
    if (res.data.status === "success") {
      setMounted(true);
    }
  };

  const rejectInvitationHandler = async (invitationId) => {
    const res = await onRejectInvitation(invitationId);
    if (res.data.status === "success") {
      setMounted(true);
    }
  };

  // my communities screen incelenebiliri, orada da community overview çağrılıyor her biri içim
  return (
    <View style={styles.screen}>
      {loading ? (
        <LinearProgress color="primary" />
      ) : invitations && invitations.length > 0 ? (
        <>
          <View>
            <Text>{me.name}'s invitations:</Text>
          </View>
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
          <View>
            <Text>{me.name}</Text>
          </View>
          <View style={{height: 10}}/>
          <Text style={styles.noInvitationText}>No invitations pending</Text>
        </View>
      )}
    </View>
  );
};

ProfileScreen.navigationOptions = (navigationData) => {
  
  return {
    headerTitle: "My Invitations",
    headerRight: (
        <Button title="Logout" onPress={() => {onLogout(); navigationData.navigation.navigate("Auth");}}/>
       
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

export default ProfileScreen;
