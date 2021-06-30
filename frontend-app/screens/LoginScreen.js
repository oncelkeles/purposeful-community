import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Button,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
  ImageBackground,
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

const image = { uri: "https://reactjs.org/logo-og.png" };

/// NewPostScreen
const LoginScreen = (props) => {
  const [mounted, setMounted] = useState(false);
  const [postTypes, setPostTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authInfo, setAuthInfo] = useState({ email: "", password: "" });

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

  const navigateHandler = (category, id, title, itemData) => {

    props.navigation.navigate({
      routeName: category,
      params: {
        postTypeId: id,
        title,
        postTypes: postTypes,
        communityId: props.navigation.state.params.communityId,
      },
    });
  };

  const onTextChangeHandler = (e, section) => {
    const value = e;
    if (section === "email") {
      setAuthInfo((prevState) => ({ ...prevState, email: value }));
    } else {
      setAuthInfo((prevState) => ({ ...prevState, password: value }));
    }
  };

  const onLoginHandler = async () => {
    await onLogin(authInfo);
    props.navigation.navigate("App");
  };

  return (
    <View style={styles.screen}>
      {/* <ImageBackground source={image} style={styles.image}> */}
        <Text>LOGIN</Text>
        <View style={{ height: 80 }} />
        <View style={styles.formField}>
          <Text>E-mail</Text>
          <TextInput
            style={styles.input}
            value={authInfo.email}
            onChangeText={(e) => onTextChangeHandler(e, "email")}
            keyboardType="email-address"
          />
        </View>
        <View style={{ height: 40 }} />
        <View style={styles.formField}>
          <Text>Password</Text>
          <TextInput
            style={styles.input}
            value={authInfo.password}
            onChangeText={(e) => onTextChangeHandler(e, "password")}
            keyboardType="default"
            secureTextEntry={true}
          />
        </View>
        <View style={{ height: 40 }} />
        <Button title="Login" onPress={onLoginHandler} />
      {/* </ImageBackground> */}
    </View>
  );
};

LoginScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Login",
  };
};

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formField: {
    width: "85%",
    height: 60,
    justifyContent: "center",
  },
});

export default LoginScreen;
