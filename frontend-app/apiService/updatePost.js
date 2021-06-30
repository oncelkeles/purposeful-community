import services from "./services";

export default async function onUpdatePost(postId, post) {
  try {
    const res = await services.patch(
      "post/" + postId,
      post
    );
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
