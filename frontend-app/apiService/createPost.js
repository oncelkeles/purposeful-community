import services from "./services";

export default async function onCreatePost(post, postTypeId, communityId) {
  try {
    const res = await services.post(
      "community/" + communityId + "/postTypes/" + postTypeId + "/posts",
      post
    );
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
