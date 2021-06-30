import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import MealItem from "./MealItem";

const MealList = (props) => {
  const navigateHandler = (route, id, title) => {
    props.navigation.navigate({
      routeName: route,
      params: {
        mealId: id,
        mealTitle: title,
        title,
      },
    });
  };

  const renderMealItem = (itemData) => {
    return (
      <MealItem
        image={itemData.item.imageUrl}
        title={itemData.item.title}
        onSelectMeal={() =>
          navigateHandler("MealDetail", itemData.item.id, itemData.item.title)
        }
        duration={itemData.item.duration}
        complexity={itemData.item.complexity}
        affordability={itemData.item.affordability}
      />
    );
  };

  return (
    <View style={styles.list}>
      <FlatList
        data={props.listData}
        keyExtractor={(item, index) => item.id}
        renderItem={renderMealItem}
        style={{ width: "100%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MealList;
