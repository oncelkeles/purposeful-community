import services from "./services";
//test4
export default async function onLogin(reqBody) {
  try {
    const res = await services.post("users/login", reqBody);
    //await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
