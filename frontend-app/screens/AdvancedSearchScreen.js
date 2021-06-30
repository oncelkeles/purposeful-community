import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ScrollView,
  Button,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import { SearchBar, SocialIcon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Switch } from "react-native-gesture-handler";

import Colors from "../constants/Colors";
import onMakeAdvancedSearch from "../apiService/makeAdvancedSearch";
import onSearchUsers from "../apiService/searchUsers";
import onSendInvitation from "../apiService/sendInvitation";
import onGetPostType from "../apiService/getPostType";
import SearchResultOverview from "../components/SearchResultOverview";

import { LinearProgress } from "react-native-elements";

import SearchFormField from "../components/SearchFormField";

const AdvancedSearchScreen = (props) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTab, setSearchTab] = useState("posts");
  const [searchString, setSearchString] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [defaultPostType, setDefaultPostType] = useState(false);
  const [fields, setFields] = useState([]);
  const [formInputs, setFormInputs] = useState([]);
  const [showSearchView, setShowSearchView] = useState(true);
  const [totalNum, setTotalNum] = useState(0);
  const [fetchedInner, setFetchedInner] = useState(false);
  //const [stateIndex, setStateIndex] = useState(0)

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

    if (mounted) {
      setDefaultPostType(props.navigation.state.params.postType);
      setMounted(false);
    }

    return () => {
      console.log("CLEAN UP");
    };
  }, [mounted]);

  useEffect(() => {
    if (defaultPostType) {
      setFields([]);
      setFormInputs([]);
      defaultPostType.communityDataTypeFields.map((item, index) => {
        setFields((prevArr) => [...prevArr, item]);
        setFormInputs((prevArr) => [...prevArr, ""]);
      });
    }
  }, [defaultPostType]);

  useEffect(() => {
    async function getDataTypeFields() {
      let temp = [...fields];
      let tempInputs = [...formInputs];
      let stateIndex = 0;
      for (let index = 0; index < fields.length; index++) {
        let item = fields[index];
        if (typeof item.fieldType === "object") {
          await onGetPostType(item.fieldType.id).then((res) => {
            let newFields = [];
            let emptyInputs = [];
            res.communityDataTypeFields.map((el, i) => {
              newFields.push({
                ...el,
                fieldName: res.title + " " + el.fieldName,
                relatedDataType: res._id,
              });
              emptyInputs.push("");
            });
            //console.log("ITEM", newFields);
            //let temp = [...fields];
            //let tempInputs = [...formInputs];
            //temp[index] = [...newFields];
            temp.splice(index + stateIndex, 1, ...newFields);
            tempInputs.splice(index + stateIndex, 1, ...emptyInputs);
            stateIndex += newFields.length - 1;
            //console.log("ITEM", temp);

            //setFields((prevArr) => [...prevArr, ...res.communityDataTypeFields]);
          });
        } 
        /* else {
          let emptyInputs = [];
          let newFields = item;
          emptyInputs.push("");
          temp.splice(index + stateIndex, 1, ...newFields);
          tempInputs.splice(index + stateIndex, 1, ...emptyInputs);
          stateIndex++;
        } */
      }
      setFields([...temp]);
      setFormInputs([...tempInputs]);
      /* fields.map(async (item, index) => {
        if (typeof item.fieldType === "object") {
          await onGetPostType(item.fieldType.id).then((res) => {
            let newFields = [];
            let emptyInputs = [];
            res.communityDataTypeFields.map((el, i) => {
              newFields.push({
                ...el,
                fieldName: "Student " + el.fieldName,
                relatedDataType: res._id,
              });
              emptyInputs.push("");
            });
            //console.log("ITEM", newFields);
            let temp = [...fields];
            let tempInputs = [...formInputs];
            temp.splice(index, 1, ...newFields);
            tempInputs.splice(index, 1, ...emptyInputs);
            //console.log("ITEM", temp);
            setFields([...temp]);
            setFormInputs([...tempInputs]);
          });
        }
      }); */
    }

    if (fields.length > 0 && !fetchedInner) {
      getDataTypeFields();
      setFetchedInner(true);
    }
  }, [fields]);

  const navigateHandler = (category, id, title, itemData) => {
    if (searchTab === "post") {
    }
    props.navigation.navigate({
      routeName: category,
      params: {
        id,
        communityId: props.navigation.state.params.communityId,
        title,
        post: itemData,
        //postTypeId: postTypeId ? postTypeId : null,
      },
    });
  };

  const onFieldInputChangeHandler = (e, index) => {
    let temp = [...formInputs];
    temp[index] = e;
    setFormInputs([...temp]);
  };

  const onFieldLocationChangeHandler = (e, index, isLat) => {
    let temp = [...formInputs];
    let tempLocation = { ...temp[index] };
    if (isLat) {
      tempLocation.lat = e;
    } else {
      tempLocation.long = e;
    }

    temp[index] = { ...tempLocation };
    setFormInputs([...temp]);
  };

  const onFieldCheckboxChangeHandler = (index) => {
    let tempArr = [...formInputs];
    let tempElement = tempArr[index];
    tempElement = !tempElement;
    tempArr[index] = tempElement;

    setFormInputs([...tempArr]);
  };

  const onFieldDropdownChangeHandler = (value, index) => {
    let temp = [...formInputs];
    let tempElement = temp[index];
    tempElement = value;
    temp[index] = tempElement;

    setFormInputs([...temp]);
  };

  const makeSearch = async () => {
    if (defaultPostType) {
      let reqBody = [];
      formInputs.map((item, index) => {
        reqBody.push({ value: item, index });
      });
      const results = await onMakeAdvancedSearch(
        props.navigation.state.params.communityId,
        defaultPostType._id,
        reqBody
      );
      setSearchResults([...results.results]);
      setTotalNum(results.total);
      setShowSearchView(false);
    }
  };

  const checkRouteDirection = (id, title, itemData) => {
    if (props.navigation.state.params.categoryId === 1) {
      navigateHandler("Post", id, title, { item: itemData });
    } else if (props.navigation.state.params.categoryId === -1) {
      //select item
      props.navigation.navigate({
        routeName: "PostForm",
        params: {
          noReload: true,
          item: itemData,
          index: props.navigation.state.params.index,
        },
      });
      //navigateHandler("PostForm", id, title, { item: itemData });
    }
  };

  const renderGridItem = (itemData) => {
    return (
      <SearchResultOverview
        post={itemData.item}
        color={itemData.item.color}
        onSelect={() => {
          checkRouteDirection(
            itemData.item.id,
            itemData.item.title,
            itemData.item.post._doc
          );
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

  const onSearchViewChangeHandler = () => {
    setShowSearchView(!showSearchView);
  };

  //console.log("FIELDS", fields);

  let searchFields;
  searchFields = (
    <ScrollView style={{ width: "100%" }}>
      {fields.map((item, index) => {
        if (typeof item.fieldType !== "object") {
          return (
            <View style={styles.formView}>
              <SearchFormField
                key={
                  item.options
                    ? "" + index + "" + item.options.length
                    : "" + index
                }
                index={index}
                label={item.fieldName}
                values={formInputs[index]}
                options={item.options}
                type={item.fieldType}
                //onSearchDataFromType={onSearchDataFromType}
                onTextChange={onFieldInputChangeHandler}
                onLocationChange={onFieldLocationChangeHandler}
                onCheckboxChange={onFieldCheckboxChangeHandler}
                onDropdownChange={onFieldDropdownChangeHandler}
                //onDataTypePostChange={onFieldDataTypePostChangeHandler}
              />
              <View style={{ height: 20 }} />
            </View>
          );
        } else {
        }
      })}
    </ScrollView>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.searchButtonView}>
        <Button title="Search" onPress={makeSearch} />
        {/* <Text>{showSearchView ? "Show Search Options" : null}</Text> */}
        <Switch
          trackColor={{ true: Colors.primary, false: "gray" }}
          thumbColor={Platform.OS === "android" ? Colors.primary : "gray"}
          value={showSearchView}
          onValueChange={() => onSearchViewChangeHandler()}
        />
        <Text style={{ color: showSearchView ? "black" : "gray" }}>
          Show Search Options
        </Text>
      </View>
      <View style={{ height: 20, width: 500, borderBottomWidth: 3 }} />
      <View style={{ height: 20 }} />
      {/* <View style={{height: showSearchView ? 1000: 10}}>{searchFields}</View> */}
      {showSearchView ? searchFields : null}
      <View style={{ height: 20, width: 500, borderBottomWidth: 3 }} />
      {searchResults.length > 0 && !showSearchView ? (
        <View>
          <Text>
            Returned {searchResults.length} from {totalNum} data
          </Text>
        </View>
      ) : null}
      {searchResults.length > 0 && !showSearchView ? (
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={styles.listScreen}
          data={searchResults}
          renderItem={renderGridItem}
          numColumns={1}
          key={"_"}
        />
      ) : !showSearchView ? (
        <View>
          <Text>No results found</Text>
        </View>
      ) : null}
      {/* <View style={styles.searchResultsView}>
        
      </View> */}
      <View style={styles.createView}>
        <TouchableComp
          style={{
            flex: 1,
            overflow: "hidden",
            borderRadius: 100,
          }}
          onPress={() => {
            props.navigation.navigate({
              routeName: "PostFromSearchForm",
              params: {
                postTypeId: props.navigation.state.params.postType._id,
                title: props.navigation.state.params.postType.title,
                postTypes: props.navigation.state.params.postType,
                communityId: props.navigation.state.params.communityId,
                goBackAfterCreate: true,
              },
            });
          }}
        >
          <Text style={{ fontSize: 16, textDecorationLine: "underline" }}>
            Create New
          </Text>
        </TouchableComp>
      </View>
    </View>
  );
};

AdvancedSearchScreen.navigationOptions = (navData) => {
  const searchName = navData.navigation.getParam("title");
  return {
    headerTitle:
      searchName && searchName !== ""
        ? searchName + " Search"
        : "Advanced Search",
  };
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    flex: 1,
  },
  createView: {
    width: "100%",
    alignItems: "center",
    height: 30,
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  /*  topView: {
    top: 0,
    position: "absolute",
    width: "100%",
  }, */
  searchButtonView: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1000,
    top: 0,
    //position: "absolute"
  },
  searchResultsView: {
    width: "100%",
  },
  formView: {
    width: "100%",
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

export default AdvancedSearchScreen;
