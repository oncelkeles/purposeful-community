import { ADD_POST_TYPE } from "../actions/postTypeActions";
import { POST_TYPES } from "../../data/data";

const initialState = {
  postTypes: POST_TYPES,
};

const postTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_TYPE:
      return {
        ...state,
        postTypes: state.postTypes.concat(action.postTypeObj),
      };
    /* case ADD_POST_TYPE2:
      const existingIndex = state.favoriteMeals.findIndex(
        (meal) => meal.id === action.mealId
      );
      if (existingIndex >= 0) {
        const updatedFavMeals = [...state.favoriteMeals];
        updatedFavMeals.splice(existingIndex, 1);
        return {
          ...state,
          favoriteMeals: updatedFavMeals,
        };
      } else {
        const newFavMeal = state.meals.find(
          (meal) => meal.id === action.mealId
        );
        return {
          ...state,
          favoriteMeals: state.favoriteMeals.concat(newFavMeal),
        };
      } */
    default:
      return state;
  }

  return state;
};

export default postTypeReducer;
