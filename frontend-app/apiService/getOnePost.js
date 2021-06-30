import services from "./services";

export default async function onGetOnePost(commnuityId, postId) {
  try {
    const res = await services.get(
      "community/" + commnuityId + "/posts/" + postId
    );
    console.log(res.data.data)
    return res.data.data;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
