import React, { useState } from "react";
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
import { useSelector, useDispatch } from "react-redux";

import { addPostType } from "../store/actions/postTypeActions";
import Colors from "../constants/Colors";

const PostTypeForm = (props) => {
  const dispatch = useDispatch();
  const availablePostTypes = useSelector((state) => state.postTypes.postTypes);

  const [formInputs, setFormInputs] = useState({
    title: "",
    description: "",
    tags: "",
    fields: [],
  });
  const [types, setTypes] = useState(["Text", "Number", "Location"]);
  const [selectedLanguage, setSelectedLanguage] = useState();

  const [newFields, setNewFields] = useState([]);

  const onInputChangeHandler = (text, field, index = -1) => {
    //console.log(formInputs);
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
      let temp = [...formInputs.fields];
      temp[index].title = text;
      setFormInputs({ ...formInputs, fields: [...temp] });
    }
  };

  const onAddField = () => {
    let temp = { ...formInputs };
    temp = {
      ...temp,
      fields: [
        ...formInputs.fields,
        { title: "", type: "", isRequired: false },
      ],
    };
    setFormInputs({ ...temp });
    //setNewFields((prevArr) => [...prevArr, newField]);
  };

  const onDropdownChangeHandler = (itemValue, itemIndex, index) => {
    let temp = [...formInputs.fields];
    temp[index].type = types[itemIndex];
    setFormInputs({ ...formInputs, fields: [...temp] });
  };

  const onRequireChangeHandler = (index) => {
    let temp = [...formInputs.fields];
    temp[index].isRequired = !temp[index].isRequired;
    setFormInputs({ ...formInputs, fields: [...temp] });
  };

  let news;
  if (formInputs.fields.length > 0) {
    news = formInputs.fields.map((el, index) => {
      return (
        <View style={styles.newFieldControl} key={index}>
          <View style={styles.newFieldInput}>
            <Text style={styles.label}>Field Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                onInputChangeHandler(text, "field", index)
              }
            />
          </View>
          <View style={styles.newFieldInput}>
            <Text style={styles.label}>Field Type</Text>
            <Picker
              selectedValue={formInputs.fields[index].type}
              onValueChange={(itemValue, itemIndex) =>
                onDropdownChangeHandler(itemValue, itemIndex, index)
              }
            >
              {/* <Picker.Item label="Java" value="java" />
              <Picker.Item label="JavaScript" value="js" /> */}
              {types.map((item, index) => {
                return (
                  <Picker.Item
                    label={types[index]}
                    value={types[index]}
                    key={index}
                  />
                );
              })}
            </Picker>
          </View>
          <View style={styles.newFieldRequire}>
            <Text style={styles.label}>Required</Text>
            <Switch
              trackColor={{ true: Colors.primary, false: "gray" }}
              thumbColor={Platform.OS === "android" ? Colors.primary : "gray"}
              value={formInputs.fields[index].isRequired}
              onValueChange={() => onRequireChangeHandler(index)}
            />
          </View>

          <View style={{ height: 100 }} />
        </View>
      );
    });
  }

  const onSubmitPostType = () => {
    dispatch(addPostType(formInputs));
    setFormInputs({ title: "", description: "", tags: "", fields: [] });
  };

  return (
    <ScrollView>
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
    marginVertical: 4,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
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
  },
});

export default PostTypeForm;
