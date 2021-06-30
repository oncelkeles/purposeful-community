import services from "./services";

export default async function onSearchUsers(name) {
  try {
    const res = await services.get("users/usersByName" + "?name=" + name);
    return res.data.data;
  } catch (error) {
    console.log("Api error: " + error.message);
  }
}
