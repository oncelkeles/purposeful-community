import services from "./services";

export default async function onGetCommunity(id) {
  try {
    const res = await services.get(
      "community/" + id
    );
    return res.data.data;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}

