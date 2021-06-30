import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Platform,
  Button,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import { Switch } from "react-native-gesture-handler";
import RNPickerSelect from "react-native-picker-select";
import { AntDesign } from "@expo/vector-icons";

import onCreatePostType from "../apiService/createPostType";
import Colors from "../constants/Colors";
import { CheckBox } from "react-native-elements";

const PostTypeFormScreen = (props) => {
  const navigateHandler = (category, id) => {
    props.navigation.navigate({
      routeName: category,
      params: {
        categoryId: id,
        communityId: props.navigation.state.params.communityId,
      },
    });
  };

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  const [postTypesList, setPostTypesList] = useState([]);
  const [postSelectionArray, setPostSelectionArray] = useState([]);
  const [formInputs, setFormInputs] = useState({
    isHidden: false,
    title: "",
    description: "",
    tags: "",
    communityDataTypeFields: [],
  });
  const [types, setTypes] = useState([
    { label: "Text", value: "Text" },
    { label: "Number", value: "Number" },
    { label: "Geolocation", value: "Geolocation" },
    { label: "Select", value: "Select" },
    { label: "Checkbox", value: "Checkbox" },
    { label: "Date", value: "Date" },
    { label: "List", value: "List" },
  ]);
  const [selectOptions, setSelectOptions] = useState([]);

  useEffect(() => {
    if (
      props.navigation.state.params.postTypes &&
      props.navigation.state.params.postTypes.length > 0
    ) {
      props.navigation.state.params.postTypes.map((item, index) => {
        setTypes((prevArr) => [
          ...prevArr,
          { label: item.title, value: { value: "DataType", id: item._id } },
        ]);
      });
    }
  }, [props.navigation]);

  const getPostsOfType = (dataTypeId) => {
    let arr = [];

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

  const onInputChangeHandler = (text, field, index = -1) => {
    if (field === "title") {
      let temp = { ...formInputs };
      temp.title = text;
      setFormInputs({ ...temp });
    } else if (field === "desc") {
      let temp = { ...formInputs };
      temp.description = text;
      setFormInputs({ ...temp });
    } else if (field === "tags") {
      let temp = { ...formInputs };
      temp.tags = text;
      setFormInputs({ ...temp });
    } else if (index > -1) {
      let temp = [...formInputs.communityDataTypeFields];
      temp[index].fieldName = text;
      setFormInputs({ ...formInputs, communityDataTypeFields: [...temp] });
    }
  };

  const onAddField = () => {
    let temp = { ...formInputs };
    temp = {
      ...temp,
      communityDataTypeFields: [
        ...formInputs.communityDataTypeFields,
        {
          fieldName: "",
          fieldType: "",
          fieldIsRequired: false,
          fieldIsEditable: true,
        },
      ],
    };
    setFormInputs({ ...temp });
  };

  const onDropdownChangeHandler = (value, index) => {
    let temp = { ...formInputs };
    let tempArr = [...temp.communityDataTypeFields];
    let tempElement = tempArr[index];
    if (value !== null && value.value && value.value === "DataType") {
      tempElement = { ...tempElement, fieldType: value };
    } else if (value === "Select") {
      tempElement = { ...tempElement, fieldType: value, options: [] };
      setSelectOptions((prevArr) => [...prevArr, { index, number: 0 }]);
    } else if (value === "List") {
      tempElement = { ...tempElement, fieldType: value };
    } else {
      tempElement = { ...tempElement, fieldType: value };
    }

    tempArr[index] = tempElement;

    temp = { ...formInputs, communityDataTypeFields: [...tempArr] };
    setFormInputs({ ...temp });
  };

  const onRequireChangeHandler = (index) => {
    let temp = [...formInputs.communityDataTypeFields];
    temp[index].fieldIsRequired = !temp[index].fieldIsRequired;
    setFormInputs({ ...formInputs, communityDataTypeFields: [...temp] });
  };

  const onEditableChangeHandler = (index) => {
    let temp = [...formInputs.communityDataTypeFields];
    temp[index].fieldIsEditable = !temp[index].fieldIsEditable;
    setFormInputs({ ...formInputs, communityDataTypeFields: [...temp] });
  };

  const onSelectOptionNumberChangeHandler = (value, index) => {
    let tempForm = { ...formInputs };
    let arr = [...tempForm.communityDataTypeFields];
    let temp = arr[index];
    let tempOptions = [];
    for (let i = 0; i < value; i++) {
      tempOptions.push("");
    }
    temp = { ...temp, options: [...tempOptions] };
    arr[index] = { ...temp };
    tempForm = { ...tempForm, communityDataTypeFields: [...arr] };
    setFormInputs({ ...tempForm });
  };

  const onSelectOptionChangeHandler = (value, optionIndex, index) => {
    let tempArr = [...formInputs.communityDataTypeFields];
    let temp = tempArr[index];
    temp.options[optionIndex] = value;
    tempArr[index] = { ...temp };
    setFormInputs({ ...formInputs, communityDataTypeFields: [...tempArr] });
  };

  const onDataTypePostChangeHandler = (value, index) => {

    let temp = { ...formInputs };
    let tempArr = [...temp.communityDataTypeFields];
    let tempElement = tempArr[index];

    tempElement = { ...tempElement, fieldName: value };

    tempArr[index] = tempElement;

    temp = { ...formInputs, communityDataTypeFields: [...tempArr] };
    setFormInputs({ ...temp });
  };

  const onRemoveFieldHandler = (index) => {
    let temp = { ...formInputs };
    setFormInputs({});
    //console.log(temp);
    let tempArr = [...temp.communityDataTypeFields];

    tempArr.splice(index, 1);

    temp = {
      ...temp,
      communityDataTypeFields: [...tempArr],
    };

    //setFormInputs({...formInputs, communityDataTypeFields: [...tempArr]} );
    setFormInputs({
      ...temp,
      communityDataTypeFields: [...tempArr],
    });
  };

  const onListTypeChangeHandler = (value, index) => {
    let temp = { ...formInputs };
    let tempArr = [...temp.communityDataTypeFields];
    let tempElement = tempArr[index];

    tempElement = {
      ...tempElement,
      listValue: value
    }
    tempArr[index] = tempElement;

    temp = { ...formInputs, communityDataTypeFields: [...tempArr] };
    setFormInputs({ ...temp });
    /* if (index > -1) {
      let temp = [...formInputs.communityDataTypeFields];
      temp[index].fieldName = text;
      setFormInputs({ ...formInputs, communityDataTypeFields: [...temp] });
    }

    let temp = { ...formInputs };
    let tempArr = [...temp.communityDataTypeFields];
    let tempElement = tempArr[index];
    if (value !== null && value.value && value.value === "DataType") {
      tempElement = { ...tempElement, fieldType: value };
    } else if (value === "Select") {
      tempElement = { ...tempElement, fieldType: value, options: [] };
      setSelectOptions((prevArr) => [...prevArr, { index, number: 0 }]);
    } else if (value === "List") {
      tempElement = { ...tempElement, fieldType: value };
    } else {
      tempElement = { ...tempElement, fieldType: value };
    }

    tempArr[index] = tempElement;

    temp = { ...formInputs, communityDataTypeFields: [...tempArr] };
    setFormInputs({ ...temp }); */
  };

  let news;
  if (formInputs.communityDataTypeFields.length > 0) {
    news = formInputs.communityDataTypeFields.map((el, index) => {
      return (
        <View style={styles.selectFieldControl} key={index}>
          <View style={styles.newFieldControl}>
            <View style={styles.newFieldInput}>
              <Text style={styles.label}>Field Name</Text>
              <TextInput
                style={styles.input}
                value={el.fieldName}
                onChangeText={(text) =>
                  onInputChangeHandler(text, "field", index)
                }
              />
            </View>
            <View style={styles.newFieldInput}>
              <Text style={styles.label}>Field Type</Text>
              <RNPickerSelect
                style={{
                  ...styles.selectBox,
                  inputAndroid: { color: "black" },
                }}
                value={el.fieldType}
                useNativeAndroidPickerStyle={false}
                fixAndroidTouchableBug={true}
                onValueChange={(value) => onDropdownChangeHandler(value, index)}
                items={[...types]}
              />
            </View>
            <View style={styles.newFieldRequire}>
              <Text style={styles.label}>Required</Text>
              <Switch
                trackColor={{ true: Colors.primary, false: "gray" }}
                thumbColor={Platform.OS === "android" ? Colors.primary : "gray"}
                value={
                  formInputs.communityDataTypeFields[index].fieldIsRequired
                }
                onValueChange={() => onRequireChangeHandler(index)}
              />
            </View>
            <View style={styles.newFieldRequire}>
              <Text style={styles.label}>Editable</Text>
              <Switch
                trackColor={{ true: Colors.primary, false: "gray" }}
                thumbColor={Platform.OS === "android" ? Colors.primary : "gray"}
                value={
                  formInputs.communityDataTypeFields[index].fieldIsEditable
                }
                onValueChange={() => onEditableChangeHandler(index)}
              />
            </View>
            <View style={styles.minusView}>
              <View style={{ width: 10 }} />
              <TouchableComp onPress={() => onRemoveFieldHandler(index)}>
                <AntDesign name="minuscircleo" size={24} color="black" />
              </TouchableComp>
            </View>

            <View style={{ height: 30 }} />
          </View>
          {formInputs.communityDataTypeFields[index].fieldType === "List" ? (
            <View style={{ width: "100%" }}>
              <View style={{ height: 10 }} />
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <View style={styles.newFieldInput}>
                  <Text style={{ flex: 1 }}>List type: </Text>
                  <RNPickerSelect
                    style={{
                      inputAndroid: { color: "black" },
                      flex: 4,
                    }}
                    value={el.fieldType}
                    useNativeAndroidPickerStyle={false}
                    fixAndroidTouchableBug={true}
                    onValueChange={(value) =>
                      onListTypeChangeHandler(value, index)
                    }
                    items={[...types]}
                  />
                </View>

                <View style={{ flex: 3 }} />
              </View>
            </View>
          ) : null}
          {formInputs.communityDataTypeFields[index].fieldType === "Select" ? (
            <View>
              <View style={{ height: 10 }} />
              <View style={styles.newFieldControl}>
                <Text style={{ flex: 3 }}>Number of options: </Text>
                <TextInput
                  style={{ ...styles.input, flex: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    onSelectOptionNumberChangeHandler(text, index)
                  }
                />
                <View style={{ flex: 3 }} />
              </View>

              {formInputs.communityDataTypeFields[index].options.map(
                (item, optionIndex) => {
                  return (
                    <View key={optionIndex}>
                      <View style={{ height: 10 }} />
                      <View>
                        <View style={styles.optionControl}>
                          <Text style={{ flex: 1 }}>
                            Option {optionIndex + 1}:{" "}
                          </Text>
                          <TextInput
                            style={{ ...styles.optionInput, flex: 3 }}
                            onChangeText={(text) =>
                              onSelectOptionChangeHandler(
                                text,
                                optionIndex,
                                index
                              )
                            }
                          />
                        </View>

                        <View style={{ flex: 1 }} />
                      </View>
                    </View>
                  );
                }
              )}
            </View>
          ) : null}
          <View style={{ height: 40 }} />
        </View>
      );
    });
  }

  const onHiddenChangeHandler = () => {
    setFormInputs((prevState) => ({
      ...prevState,
      isHidden: !prevState.isHidden,
    }));
  };

  const onSubmitPostType = () => {
    const reqBody = {
      ...formInputs,
    };
    onCreatePostType(reqBody, props.navigation.state.params.communityId);
    /* dispatch(addPostType(reqBody));
    setFormInputs({ title: "", description: "", tags: "", fields: [] }); */
    navigateHandler("NewPost", 0, "NewPost");
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControlHidden}>
          <Text style={styles.label}>Hidden:</Text>
          <CheckBox
            checked={formInputs.isHidden}
            onPress={() => onHiddenChangeHandler()}
          />
          <View style={{ height: 30 }} />
        </View>

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
        {news}
        <View style={{ height: 30 }} />
        <View style={styles.addButton}>
          <Button
            title="Add Field"
            onPress={onAddField}
            style={styles.addButton}
          />
        </View>

        <View style={{ height: 20 }} />
        <Button title="Submit Post Type" onPress={onSubmitPostType} />
      </View>
    </ScrollView>
  );
};

PostTypeFormScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "New Post Type",
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formControlHidden: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
  },
  minusView: {
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
  },
  form: {
    margin: 20,
  },
  formControl: {
    width: "100%",
  },
  label: {
    marginVertical: 4,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  selectFieldControl: {
    flexDirection: "column",
  },
  optionControl: {
    flexDirection: "row",
    width: "100%",
  },
  optionInput: {
    paddingHorizontal: 2,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  addOptionView: {
    borderRadius: 15,
  },
  newFieldControl: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  newFieldInput: {
    flex: 7,
  },
  addButton: {
    width: "40%",
  },
  newFieldRequire: {
    flex: 4,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  selectBox: {
    overflow: "hidden",
    fontSize: 8,
  },
  newFieldDataTypeInput: {
    flex: 7,
    overflow: "hidden",
  },
});

export default PostTypeFormScreen;
