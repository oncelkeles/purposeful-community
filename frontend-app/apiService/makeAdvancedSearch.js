import services from "./services";

export default async function onMakeAdvancedSearch(commnuityId, postTypeId, inputs) {
  try {
    const res = await services.post(
      "community/search/" + commnuityId + "/postType/" + postTypeId, inputs
    );
    return res.data.data;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
