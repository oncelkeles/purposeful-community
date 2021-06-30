import services from "./services";

export default async function onJoinCommunity(communityId) {
  try {
    const res = await services.post("community/" + communityId + "/join");
    return res.data.data;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
