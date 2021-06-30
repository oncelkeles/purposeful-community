import PostType from "../models/postType";

export const POST_TYPES = [
    new PostType(
      1,
      "Ingredient",
      "Create a ingredient for any food you want!",
      ["food", "ingredient", "taste"],
      [
        {
          title: "Taste",
          type: "Select",
          isRequired: true,
          options: ["Sour", "Sweet", "Bitter", "Spicy"],
        },
        {
          title: "Is Vegan",
          type: "Checkbox",
          isRequired: true,
        },
      ]
    ),
    new PostType(
      2,
      "Availability",
      "Is the ingredient available!?",
      ["food", "availability", "check"],
      [
        {
          title: "Store Location",
          type: "Location",
          isRequired: true,
        },
        {
          title: "Is Available",
          type: "Checkbox",
          isRequired: true,
        },
      ]
    ),
  ];