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
import { Switch } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import onCreateCommunity from "../apiService/createCommunity";
import Colors from "../constants/Colors";

const CommunityFormScreen = (props) => {
  const [mounted, setMounted] = useState(false);

  const navigateHandler = (category, id, title, community) => {

    props.navigation.navigate({
      routeName: category,
      params: {
        id,
        title,
        community,
      },
    });
  };

  const postTypeId = props.navigation.getParam("postTypeId");



  const [formInputs, setFormInputs] = useState({
    name: "",
    description: "",
    tags: "",
    isPublic: true,
  });

  const [postType, setPostType] = useState(undefined);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      // Fetch profile data
      setMounted(true);
    });

    return () => {
      unsubscribe;
    };
  }, [props.navigation]);

  const onInputChangeHandler = (e, fieldName) => {
    let temp = { ...formInputs };
    temp = { ...temp, [fieldName]: e };

    setFormInputs({ ...temp });
  };

  const onPublicChangeHandler = (index) => {
    /* let temp = {...formInputs}
    temp = {
      ...temp
    }
    setFormInputs({ ...formInputs, communityDataTypeFields: [...temp] }); */
    setFormInputs((prevState) => ({
      ...prevState,
      isPublic: !prevState.isPublic,
    }));
  };

  let form;
  form = (
    <View style={styles.form}>
      <View style={styles.formControl}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={formInputs.name}
          onChangeText={(text) => onInputChangeHandler(text, "name")}
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

      <View style={styles.publicControl}>
        <Text style={ styles.label}>{!formInputs.isPublic ? "Private" : "Public"}</Text>
        <Switch
          trackColor={{ true: Colors.primary, false: "gray" }}
          thumbColor={Platform.OS === "android" ? Colors.primary : "gray"}
          value={!formInputs.isPublic}
          onValueChange={() => onPublicChangeHandler()}
        />
        <View style={{ height: 30 }} />
      </View>

      <View style={{ height: 30 }} />

      <View style={{ height: 20 }} />
    </View>
  );

  const onSubmitCommunity = async () => {
    /// TODO - post ve posttype id'si gönder
    //onCreatePost(formInputs)
    let tempInputs = { ...formInputs };
    let tagArr = formInputs.tags.split(",");
    tempInputs = {
      ...tempInputs,
      tags: [...tagArr],
    };
    await onCreateCommunity(tempInputs)
      .then((res) => {
        navigateHandler("Community", res._id, res.name, res);
      })
      .catch((err) => console.log(err));
    //
  };

  const onSubmitPos2t = () => {
    /// TODO - post ve posttype id'si gönder
    //onCreatePost(formInputs)


  };

  return (
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
        <Button title="Create Community" onPress={onSubmitCommunity} />
      </View>
    </ScrollView>
  );
};

CommunityFormScreen.navigationOptions = (navigationData) => {
  const postTypeTitle = navigationData.navigation.getParam("title");

  return {
    headerTitle: "New Community",
  };
};

const styles = StyleSheet.create({
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
  publicControl: {
    flexDirection: "row"
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

export default CommunityFormScreen;
