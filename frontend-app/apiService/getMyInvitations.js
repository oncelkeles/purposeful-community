import services from "./services";

export default async function onGetMyInvitations() {
  try {
    const res = await services.get("invitations/");
    return res.data.data.data;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
