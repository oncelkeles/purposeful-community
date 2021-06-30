import services from "./services";

export default async function onGetPostsFromPostType(commnuityId, postTypeId) {
  try {
    const res = await services.get(
      "community/" + commnuityId + "/postTypes/" + postTypeId + "/posts"
    );
    return res.data.data;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
