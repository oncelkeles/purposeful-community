import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { LinearProgress } from "react-native-elements";

import services from "../apiService/services";
import onCreatePost from "../apiService/createPost";
import onGetPostsFromPostType from "../apiService/getPostsFromPostType";
import { POST_TYPES } from "../data/data";
import FormField from "../components/FormField";
import NewPostScreen from "./NewPostScreen";
import MealItem from "../components/MealItem";
import MealList from "../components/MealList";

const PostFormScreen = (props) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigateHandler = (category, id, postType, title, index) => {
    props.navigation.navigate({
      routeName: category,
      params: {
        categoryId: id,
        postType,
        title,
        communityId: props.navigation.state.params.communityId,
        index,
      },
    });
  };

  const postTypeId = props.navigation.getParam("postTypeId");
  const availablePostTypes = useSelector((state) => state.postTypes.postTypes);
  const displayedPostType = availablePostTypes.filter(
    (postType) => postType.id === postTypeId
  );


  const [formInputs, setFormInputs] = useState({
    title: "",
    description: "",
    tags: "",
    postFields: [],
  });
  const [types, setTypes] = useState(["Text", "Number", "Geolocation"]);
  const [rerender, setRerender] = useState(false);
  const [postType, setPostType] = useState(undefined);

  const onFieldDataTypePostChangeHandler = (value, label, index) => {
    let temp = { ...formInputs };
    let tempArr = [...temp.postFields];
    let tempElement = tempArr[index];
    tempElement = { id: value, label };
    tempArr[index] = tempElement;
    temp = { ...formInputs, postFields: [...tempArr] };
    setFormInputs({ ...temp });
    /* let temp = { ...formInputs };
    let tempArr = [...temp.communityDataTypeFields];
    let tempElement = tempArr[index];

    tempElement = { ...tempElement, fieldName: value };

    tempArr[index] = tempElement;

    temp = { ...formInputs, communityDataTypeFields: [...tempArr] };
    setFormInputs({ ...temp }); */
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      // Fetch profile data
      if (
        props.navigation.state.params.noReload &&
        props.navigation.state.params.item
      ) {
        onFieldDataTypePostChangeHandler(
          props.navigation.state.params.item._id,
          props.navigation.state.params.item.title,
          props.navigation.state.params.index
        );
      } else {
        setFormInputs({
          title: "",
          description: "",
          tags: "",
          postFields: [],
        });
        setMounted(true);
      }
    });

    return () => {
      unsubscribe;
    };
  }, [props.navigation]);

  const getPosts = async (commnuityId, postTypeId) => {
    const result = await onGetPostsFromPostType(commnuityId, postTypeId);
    return result;
  };

  const getPostsOfType = (dataTypeId) => {
    getPosts(props.navigation.state.params.communityId, dataTypeId)
      .then((res) => {
        if (res.length > 0) {
          return res;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSearchDataFromType = (postType, prs) => {
    const dataType = props.navigation.state.params.postTypes.find(
      (p) => p._id === prs.type.id
    );
    navigateHandler("AdvancedSearch", -1, dataType, postType, prs.index);
  };

  useEffect(() => {
    const id = props.navigation.state.params.postTypeId;
    async function fetchPostType() {
      try {
        //setLoadingTable(true);
        const res = await services.get("postType/" + id);
        let x = res.data.data.data;
        setPostType(res.data.data.data);
        let temp = { ...formInputs };
        x.communityDataTypeFields.map((item, index) => {
          if (item.fieldType === "Checkbox") {
            temp.postFields.push(false);
          } else if (item.fieldType === "Select") {
            temp.postFields.push("Select one");
          } else if (item.fieldType === "Geolocation") {
            temp.postFields.push({ lat: 0, long: 0 });
          } else if (item.fieldType === "Date") {
            temp.postFields.push(Date.now());
          } else if (
            typeof item.fieldType === "object" &&
            item.fieldType.value === "DataType"
          ) {
            temp.postFields.push("Select one");
            getPosts(
              props.navigation.state.params.communityId,
              item.fieldType.id
            )
              .then(async (result) => {
                await result;
                x.communityDataTypeFields[index] = {
                  ...x.communityDataTypeFields[index],
                  options: result,
                };

                setPostType(x);
                setRerender(true);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            temp.postFields.push("");
          }
        });
        setFormInputs({ ...temp });
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        message.error(
          "Could not fetch post type! Please try reloading the page."
        );
      }
    }
    if (mounted) {
      fetchPostType();
      setMounted(false);
    }
  }, [mounted]);

  const onInputChangeHandler = (e, fieldName) => {
    let temp = { ...formInputs };
    temp = { ...temp, [fieldName]: e };

    setFormInputs({ ...temp });
  };

  const onFieldInputChangeHandler = (e, index) => {
    let temp = [...formInputs.postFields];
    temp[index] = e;
    setFormInputs({
      ...formInputs,
      postFields: [...temp],
    });
  };

  const onFieldLocationChangeHandler = (e, index, isLat) => {
    let temp = [...formInputs.postFields];
    let tempLocation = { ...temp[index] };
    if (isLat) {
      tempLocation.lat = e;
    } else {
      tempLocation.long = e;
    }

    temp[index] = { ...tempLocation };
    setFormInputs({
      ...formInputs,
      postFields: [...temp],
    });
  };

  const onFieldCheckboxChangeHandler = (index) => {
    let temp = { ...formInputs };
    let tempArr = [...temp.postFields];
    let tempElement = tempArr[index];
    tempElement = !tempElement;
    tempArr[index] = tempElement;
    debugger;
    temp = { ...formInputs, postFields: [...tempArr] };
    setFormInputs({ ...temp });
  };

  const onFieldDropdownChangeHandler = (value, index) => {
    let temp = { ...formInputs };
    let tempArr = [...temp.postFields];
    let tempElement = tempArr[index];
    tempElement = value;
    tempArr[index] = tempElement;

    temp = { ...formInputs, postFields: [...tempArr] };
    setFormInputs({ ...temp });

  };

  const onDropdownChangeHandler = (itemValue, itemIndex) => {
    let temp = availablePostTypes[itemIndex];
    setPostType({
      ...temp,
    });
    setFormInputs({
      ...formInputs,
      postFields: temp.postFields.map((item, index) => {
        if (item.type === "Text") {
          return { values: "" };
        } else if (item.type === "Number") {
          return { values: 0 };
        } else if (item.type === "Geolocation") {
          return {
            values: {
              lat: 0,
              long: 0,
            },
          };
        }
      }),
    });
  };

  /// field change handlers
  const onFieldTextChangeHandler = (e) => {
    let temp = availablePostTypes[itemIndex];
  };

  let form;
  if (formInputs.postFields.length > 0) {
    form = (
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={formInputs.title}
            onChangeText={(text) => onInputChangeHandler(text, "title")}
          />
          <View style={{ height: 30 }} />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={formInputs.description}
            onChangeText={(text) => onInputChangeHandler(text, "description")}
          />
          <View style={{ height: 30 }} />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Tags(with comma)</Text>
          <TextInput
            style={styles.input}
            value={formInputs.tags}
            onChangeText={(text) => onInputChangeHandler(text, "tags")}
          />
          <View style={{ height: 30 }} />
        </View>

        {postType.communityDataTypeFields.map((item, index) => {
          return (
            <FormField
              key={
                item.options
                  ? "" + index + "" + item.options.length
                  : "" + index
              }
              index={index}
              label={item.fieldName}
              values={formInputs.postFields[index]}
              options={item.options}
              communityId={props.navigation.state.params.communityId}
              //dataTypeOptions
              type={item.fieldType}
              onSearchDataFromType={onSearchDataFromType}
              onTextChange={onFieldInputChangeHandler}
              onLocationChange={onFieldLocationChangeHandler}
              onCheckboxChange={onFieldCheckboxChangeHandler}
              onDropdownChange={onFieldDropdownChangeHandler}
              onDataTypePostChange={onFieldDataTypePostChangeHandler}
              /* onTextChange={(e) => onFieldInputChangeHandler(e, index)}
              onLocationChange={(e) => onFieldLocationChangeHandler(e, index)}
              onCheckboxChange={() => onFieldCheckboxChangeHandler(index)}
              onDropdownChange={(value) => onFieldDropdownChangeHandler(value, index)} */
            />
          );
        })}
        <View style={{ height: 30 }} />

        <View style={{ height: 20 }} />
      </View>
    );
  }

  const onSubmitPost = async () => {
    /// TODO - post ve posttype id'si gönder
    //onCreatePost(formInputs)
    let tempInputs = { ...formInputs };
    let temp;
    tempInputs.postFields.map((item, index) => {
      temp = {
        label: postType.communityDataTypeFields[index].fieldName,
        value: item,
        dataType: postType.communityDataTypeFields[index].fieldType,
        isEditable: postType.communityDataTypeFields[index].fieldIsEditable,
      };
      tempInputs.postFields[index] = temp;
    });
    let tagArr = tempInputs.tags.split(",");
    tempInputs = {
      ...tempInputs,
      tags: [...tagArr],
      isHidden: postType.isHidden
    };
    await onCreatePost(
      tempInputs,
      postTypeId,
      props.navigation.state.params.communityId
    );
    if (props.navigation.state.params.goBackAfterCreate) {
      props.navigation.goBack()
    } else {
      navigateHandler("Community", "0");
    }
   
  };

  const onSubmitPos2t = () => {
    /// TODO - post ve posttype id'si gönder
    //onCreatePost(formInputs)
    let tempInputs = { ...formInputs };
    let temp;
    tempInputs.postFields.map((item, index) => {
      temp = {
        label: postType.communityDataTypeFields[index].fieldName,
        value: item,
      };
      tempInputs.postFields[index] = temp;
    });
    let tagArr = tempInputs.tags; //.split(",");
    tempInputs = {
      ...tempInputs,
      tags: [...tagArr],
    };
  };

  return (
    <>
      {loading ? (
        <View style={styles.loadingScreen}>
          <LinearProgress color="primary" />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.form}>
            {/* <Picker
          selectedValue={postType}
          onValueChange={(itemValue, itemIndex) =>
            onDropdownChangeHandler(itemValue, itemIndex)
          }
        >
          {availablePostTypes.map((item, index) => {
            return (
              <Picker.Item label={item.title} value={item.title} key={index} />
            );
          })}
        </Picker> */}
            <View style={{ height: 20 }} />
            {form}
            <Button title="Submit Post" onPress={onSubmitPost} />
          </View>
        </ScrollView>
      )}
    </>
  );
};

PostFormScreen.navigationOptions = (navigationData) => {
  const postTypeTitle = navigationData.navigation.getParam("title");

  return {
    headerTitle: "New " + postTypeTitle,
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    margin: 20,
  },
  formControl: {
    width: "100%",
  },
  label: {
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  newFieldControl: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  newFieldInput: {
    width: "45%",
  },
  addButton: {
    width: "40%",
  },
});

export default PostFormScreen;
