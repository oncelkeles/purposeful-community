import services from "./services";

export default async function onGetPostTypes(commnuityId) {
  try {
    const res = await services.get(
      "community/"+ commnuityId+ "/postTypes/"
    );
    return res.data.data.data;
    //console.log(postType)
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}

