import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Button,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
} from "react-native";
import moment from "moment";
import { CheckBox } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useSelector, useDispatch } from "react-redux";

import onGetPostsFromPostType from "../apiService/getPostsFromPostType";

const FormField = (props) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  const [field, setField] = useState(
    <View>
      <Text>loading...</Text>
    </View>
  );

  const [rerender, setRerender] = useState(false);
  // for dates
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  let fields;
  if (
    typeof props.type === "object" &&
    props.type.value &&
    props.type.value === "DataType"
  ) {
    let dataOptions = props.options.map((item) => {
      return { label: item.label, value: item.value };
    });

    fields = (
      <View style={styles.formControl}>
        <View style={styles.dataTypeLabel}>
          <Text style={styles.label}>{props.label + ": "}</Text>
          {props.values && props.values.label ? (
            <Text style={{ fontSize: 18 }}>{props.values.label}</Text>
          ) : null}
        </View>

        <TouchableComp
          onPress={() => {
            props.onSearchDataFromType(props.label, props);
          }}
        >
          <View style={styles.container}>
            <Text style={styles.textSearch}>
              {props.values && props.values.label
                ? "Search another " + props.label
                : "Search " + props.label}
            </Text>
          </View>
        </TouchableComp>
        {/* <RNPickerSelect
          style={{
            ...styles.selectBox,
            inputAndroid: { color: "black" },
          }}
          useNativeAndroidPickerStyle={false}
          fixAndroidTouchableBug={true}
          onValueChange={(value, opIndex) =>
            props.onDataTypePostChange(
              value,
              dataOptions[opIndex - 1].label,
              props.index
            )
          }
          items={[...dataOptions]}
        /> */}
      </View>
    );
  } else if (props.type === "Text") {
    fields = (
      <View style={styles.formControl}>
        <Text style={styles.label}>{props.label}</Text>
        <TextInput
          style={styles.input}
          value={props.values}
          onChangeText={(e) => props.onTextChange(e, props.index)}
          keyboardType="default"
        />
      </View>
    );
  } else if (props.type === "List") {
    let listValues = "";

    /*  props.values.map((item, index) => {
      listValues = listValues + "," + item;
    }); */
    fields = (
      <View style={styles.formControl}>
        <Text style={styles.label}>sgsdg</Text>
        <TextInput
          style={styles.input}
          value={props.values}
          onChangeText={(e) => props.onTextChange(e, props.index)}
          keyboardType="default"
        />
      </View>
    );
  }
  // numeric
  else if (props.type === "Number") {
    fields = (
      <View style={styles.formControl}>
        <Text style={styles.label}>{props.label}</Text>
        <TextInput
          style={styles.input}
          value={props.values}
          onChangeText={(e) => props.onTextChange(e, props.index)}
          keyboardType="numeric"
        />
      </View>
    );
  }
  // location
  else if (props.type === "Geolocation") {
    fields = (
      <View style={styles.formControl}>
        <View style={{ height: 20 }} />
        <Text style={styles.label}>{props.label}</Text>
        <View style={styles.locationInput}>
          <View style={{ width: "40%" }}>
            <Text style={styles.label}>Latitude</Text>
            <TextInput
              style={styles.input}
              //value={props.values.lat}
              onChangeText={(e) => {
                props.onLocationChange(e, props.index, true);
              }}
              keyboardType="numeric"
            />
          </View>
          <View style={{ width: "40%" }}>
            <Text style={styles.label}>Longitude</Text>
            <TextInput
              style={styles.input}
              //value={props.values.long}
              onLocationChange={(e) =>
                props.onLocationChange(e, props.index, false)
              }
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
    );
  } else if (props.type === "Checkbox") {
    fields = (
      <View style={styles.checkboxContainer}>
        <CheckBox
          checked={props.values}
          onPress={() => props.onCheckboxChange(props.index)}
        />
        <Text>{props.label}</Text>
      </View>
    );
  } else if (props.type === "Select") {
    let options = props.options.map((item) => {
      return { label: item, value: item };
    });
    /* console.log(props.values)
    if (props.values) {
      props.onDropdownChange(props.values, props.index);
    } */

    fields = (
      <View style={styles.formControl}>
        <Text>{props.label}</Text>
        <RNPickerSelect
          style={{ ...styles.selectBox, inputAndroid: { color: "black" } }}
          useNativeAndroidPickerStyle={false}
          fixAndroidTouchableBug={true}
          value={props.values}
          onValueChange={(value) => props.onDropdownChange(value, props.index)}
          items={[...options]}
          //value={props.values ? props.values : options[0].value}
        />
      </View>
    );
  } else if (props.type === "Date") {
    fields = (
      <View style={{ ...styles.formControl, marginTop: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>{props.label}: </Text>
         <Text> {moment(props.valuese).format("D MMM YY")}</Text>
          <Button onPress={showDatepicker} title={ props.values ? "Pick another date" : "Pick date"} />
        </View>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={props.values}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    );
  }

  return <>{fields}</>;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textSearch: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
  dataTypeLabel: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    //justifyContent: "center"
  },

  form: {
    margin: 20,
  },
  formControl: {
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
  },
  label: {
    marginVertical: 8,
  },
  selectBox: {
    width: 100,
    height: 100,
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 2,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  locationInput: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
});

export default FormField;
