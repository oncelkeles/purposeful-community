import services from "./services";

export default async function onGetUserName(userId) {
  try {
    const res = await services.get(
      "users/userName/"+ userId
    );
    return res.data.data.userName;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}

