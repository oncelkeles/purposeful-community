import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import moment from "moment";
import { CheckBox } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useSelector, useDispatch } from "react-redux";

const UserOverview = (props) => {
  const { user } = props;
  const [isInvited, setIsInvited] = useState(false);

  useEffect(() => {
    setIsInvited(user.invites.some((p) => p.community === props.communityId));
  }, [props]);

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

 


  return (
    <View style={styles.overviewBox}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>{user.name}</Text>
        <View style={{ height: 10 }} />
        <Text style={styles.descriptionText}>{user.email}</Text>
      </View>
      {isInvited ? (
        <View>
          <Text style={styles.alreadyInvitedText}>Already invited</Text>
        </View>
      ) : (
        <TouchableComp
          style={{
            flex: 1,
            overflow: "hidden",
            borderRadius: 100,
          }}
          onPress={() => {
            props.onSelect();
            setIsInvited(true)
          }}
        >
          <View>
            <Text style={styles.inviteText}>Invite</Text>
          </View>
        </TouchableComp>
      )}

      {/* <View style={styles.infoView}>
          <View>
            <Text style={styles.tagsText}>{tags}</Text>
          </View>
          <View>
            <Text style={styles.createInfoText}>{userName}</Text>
            <Text style={styles.createDateText}>
              {moment(user.createdAt).format("D MMM YY")}
            </Text>
          </View>
        </View> */}
      {/* <Text>{props.title}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  overviewBox: {
    maxWidth: "90%",
    width: 450,
    backgroundColor: "#efdbff",
    height: 100,
    marginBottom: 5,
    marginTop: 5,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    overflow: "hidden",
  },
  inviteText: {
    fontSize: 18,
    textDecorationLine: "underline",
  },
  alreadyInvitedText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  titleView: {
    height: "70%",
    width: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    paddingTop: 15,
  },
  infoView: {
    flexDirection: "row",
    height: "30%",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  tagsText: {
    fontStyle: "italic",
    fontSize: 12,
  },
  createInfoText: {
    fontSize: 14,
  },
  createDateText: {
    fontSize: 12,
  },
  descriptionText: {
    fontSize: 12,
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

export default UserOverview;
