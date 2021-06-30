import services from "./services";

export default async function onGetMyCommunities(text) {
  try {
    const res = await services.get("community/me");
    return res.data.data;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
