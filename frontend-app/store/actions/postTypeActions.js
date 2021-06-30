export const ADD_POST_TYPE = "ADD_POST_TYPE";

export const addPostType = (postTypeObj) => {
  return {
    type: ADD_POST_TYPE,
    postTypeObj
  };
};
