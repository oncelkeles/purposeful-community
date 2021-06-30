import services from "./services";

export default async function onSendInvitation(invitation) {
  try {
    const res = await services.post("invitations/", invitation);
    return res;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
