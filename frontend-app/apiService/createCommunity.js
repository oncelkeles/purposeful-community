import services from "./services";

export default async function onCreateCommunity(community) {
  try {
    const res = await services.post(
      "community",
      community
    );
    return res.data.data.data;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
