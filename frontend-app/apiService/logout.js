import services from "./services";
//test4
export default async function onLogout() {
  try {
    const res = await services.get("users/logout");
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
