import services from "./services";

export default async function onSearchPostTypes(commnuityId, reqBody) {
  try {
    const res = await services.post(
      "community/search/"+ commnuityId+ "/postTypes/",
      reqBody
    );
    return res.data.data;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}

