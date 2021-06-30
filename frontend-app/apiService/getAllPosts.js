import services from "./services";

export default async function onGetAllPosts(text) {
  try {
    const res = await services.get(
      "post" + "?title=" + text
    );
    return res.data.data;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}

