import React from "react";
import { Platform, Text } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createDrawerNavigator } from "react-navigation-drawer";

import PostTypeFormScreen from "../screens/PostTypeFormScreen";
import _PostFormScreen from "../screens/_PostFormScreen";
import FiltersScreen from "../screens/FiltersScreen";
import NewPostScreen from "../screens/NewPostScreen";
import CommunityScreen from "../screens/CommunityScreen";
import MyCommunitiesScreen from "../screens/MyCommunitiesScreen";
import PostFormScreen from "../screens/PostFormScreen";
import SearchPostTypesScreen from "../screens/SearchPostTypesScreen";
import UserSearchScreen from "../screens/UserSearchScreen";
import CommunityFormScreen from "../screens/CommunityFormScreen";
import PostFromSearchFormScreen from "../screens/PostFromSearchFormScreen";
import PostScreen from "../screens/PostScreen";
import PostLinkScreen from "../screens/PostLinkScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CommunityInvitationsScreen from "../screens/CommunityInvitationsScreens";
import AdvancedSearchScreen from "../screens/AdvancedSearchScreen";
import LoginScreen from "../screens/LoginScreen";
import Colors from "../constants/Colors";

const defaultStackNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const MyStackNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.third : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.third,
};

const MyProfileNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.accent : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.accent,
};

const AuthStack = createStackNavigator({ Login: LoginScreen });

const SearchNavigator = createStackNavigator(
  {
    Search: SearchScreen,
    Community: CommunityScreen,
    NewPost: NewPostScreen,
    PostForm: {
      screen: PostFormScreen,
    },
    PostTypeForm: PostTypeFormScreen,
    Post: PostScreen,
    PostLink: PostLinkScreen,
    CommunityForm: CommunityFormScreen,
    UserSearch: UserSearchScreen,
    CommunityInvitations: CommunityInvitationsScreen,
    AdvancedSearch: AdvancedSearchScreen,
    SearchPostTypes: SearchPostTypesScreen,
    PostFromSearchForm: PostFromSearchFormScreen,
    /*  PostTypeForm: PostTypeFormScreen,
    PostForm: PostFormScreen, */
  },
  {
    // mode: "card",
    // initialRouteName: "Categories",
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

const MyCommunitiesNavigator = createStackNavigator(
  {
    MyCommunities: MyCommunitiesScreen,
    Community: CommunityScreen,
    NewPost: NewPostScreen,
    PostForm: {
      screen: PostFormScreen,
    },
    PostTypeForm: PostTypeFormScreen,
    Post: PostScreen,
    PostLink: PostLinkScreen,
    UserSearch: UserSearchScreen,
    CommunityInvitations: CommunityInvitationsScreen,
    AdvancedSearch: AdvancedSearchScreen,
    SearchPostTypes: SearchPostTypesScreen,
    PostFromSearchForm: PostFromSearchFormScreen,
  },
  {
    // mode: "card",
    // initialRouteName: "Categories",
    defaultNavigationOptions: MyStackNavOptions,
  }
);

const InvitationNavigator = createStackNavigator(
  {
    Profile: ProfileScreen,
    Community: CommunityScreen,
  },
  {
    defaultNavigationOptions: MyProfileNavOptions,
  }
);

const tabScreenConfig = {
  Search: {
    screen: SearchNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return (
          <Ionicons
            name="md-search-sharp"
            size={25}
            color={tabInfo.tintColor}
          />
        );
      },
      tabBarColor: Colors.primary,
      tabBarLabel:
        Platform.OS === "android" ? (
          <Text style={{ fontFamily: "open-sans-bold" }}></Text>
        ) : (
          "Search"
        ),
    },
  },
  MyCommunities: {
    screen: MyCommunitiesNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return (
          <MaterialCommunityIcons
            style={{ width: 50, height: 50, paddingLeft: 10, marginTop: -6 }}
            name="home-group"
            size={36}
            color={tabInfo.tintColor}
          />
        );
      },
      tabBarColor: Colors.third,
      tabBarLabel:
        Platform.OS === "android" ? (
          <Text style={{ fontFamily: "open-sans-bold" }}></Text>
        ) : (
          "My Communities"
        ),
    },
  },
  Favorites: {
    screen: InvitationNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Octicons name="inbox" size={24} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.accent,
      tabBarLabel:
        Platform.OS === "android" ? (
          <Text style={{ fontFamily: "open-sans-bold" }}></Text>
        ) : (
          "Invitations"
        ),
    },
  },
};

const SearchNavigatorDrawer =
  Platform.OS === "android"
    ? createMaterialBottomTabNavigator(tabScreenConfig, {
        activeColor: "white",
        shifting: true,
        /* barStyle: {
          backgroundColor: Colors.primary,
        }, */
      })
    : createBottomTabNavigator(tabScreenConfig, {
        tabBarOptions: {
          showLabel: true,
          labelStyle: {
            fontFamily: "open-sans-bold",
          },
          activeTintColor: Colors.accent,
        },
      });

const FiltersNavigator = createStackNavigator(
  {
    Filters: FiltersScreen,
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

/* export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
); */

const MainNavigator = createDrawerNavigator(
  {
    Searches: {
      screen: SearchNavigatorDrawer,
      navigationOptions: {
        drawerLabel: "Search",
      },
    },
    Filters: FiltersNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.accent,
      labelStyle: {
        fontFamily: "open-sans-bold",
      },
    },
  }
);

const RootStack = createSwitchNavigator(
  {
    Auth: AuthStack,
    App: MainNavigator,
  },
  {
    initialRouteName: "Auth",
  }
);

export default createAppContainer(RootStack);
