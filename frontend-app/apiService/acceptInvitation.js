import services from "./services";

export default async function onAcceptInvitation(invitationId) {
  try {
    const res = await services.post("invitations/" + invitationId + "/accept");
    return res;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
