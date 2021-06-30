import services from "./services";

export default async function onSearchCommunities(text) {
  try {
    const res = await services.get(
      "community/search" + "?title=" + text
    );
    return res.data.data;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}

