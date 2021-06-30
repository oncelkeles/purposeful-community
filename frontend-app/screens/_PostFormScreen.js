import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import FormField from "../components/FormField";

const PostFormScreen = (props) => {
  const navigateHandler = (category, id) => {
    props.navigation.navigate({
      routeName: category,
      params: {
        categoryId: id,
      },
    });
  };

  const dispatch = useDispatch();
  const availablePostTypes = useSelector((state) => state.postTypes.postTypes);

  const [formInputs, setFormInputs] = useState({
    title: "",
    description: "",
    tags: "",
    fields: [],
  });
  const [types, setTypes] = useState(["Text", "Number", "Location"]);
  const [postType, setPostType] = useState({});

  const onInputChangeHandler = (e) => {
    console.log(e.target.value);
  };

  const onFieldInputChangeHandler = (e) => {};

  const onDropdownChangeHandler = (itemValue, itemIndex) => {
    console.log(availablePostTypes[itemIndex]);
    let temp = availablePostTypes[itemIndex];
    setPostType({
      ...temp,
    });
    setFormInputs({
      ...formInputs,
      fields: temp.fields.map((item, index) => {
        if (item.type === "Text") {
          return { values: "" };
        } else if (item.type === "Number") {
          return { values: 0 };
        } else if (item.type === "Location") {
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

  let form;
  if (postType.title) {
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
            onChangeText={(text) => onInputChangeHandler(text, "desc")}
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
        {postType.fields.map((item, index) => {
          return (
            <FormField
              key={index}
              label={item.title}
              values={formInputs.fields[index].values}
              type={item.type}
              onChange={onFieldInputChangeHandler}
            />
          );
        })}
        <View style={{ height: 30 }} />

        <View style={{ height: 20 }} />
      </View>
    );
  }

  const onSubmitPost = () => {
    console.log(formInputs);
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <Picker
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
        </Picker>
        <View style={{ height: 20 }} />
        {form}
        <Button title="Submit Post Type" onPress={onSubmitPost} />
      </View>
    </ScrollView>
  );
};

PostFormScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Post Form",
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
