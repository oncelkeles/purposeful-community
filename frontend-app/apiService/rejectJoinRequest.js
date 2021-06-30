import services from "./services";

export default async function onRejectJoinRequest(communityId, reqBody) {
  try {
    const res = await services.post(
      "community/" + communityId + "/reject",
      reqBody
    );
    return res.data.data.data;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
