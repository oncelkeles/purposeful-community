import services from "./services";

export default async function onCreatePostType(postType, communityId) {
  try {
    const res = await services.post(
      "community/" + communityId + "/postTypes",
      postType
    );
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
