import { useState } from "react";
import { MealType } from "../../Types/Meal";
import Meal from "./Meal";
import { collateIngredients } from "../../utils/collateIngredients";
import ShoppingList from "../ShoppingList";
import { getTheme } from "@fluentui/react";
import { DAYS_OF_WEEK } from "../../lib/globalConsts";

type MealPlanCardProps = {
  title: string;
  meals: MealType[];
};

export default function MealPlanCard({ title, meals }: MealPlanCardProps) {
  const theme = getTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleShoppingList = () => {
    setShowShoppingList((prev) => !prev);
  };

  const ingredientCounts = collateIngredients(meals);

  return (
    <div style={{ boxShadow: theme.effects.elevation8, width: "100%" }}></div>
  );

  // return (
  //   <div
  //     style={{
  //       border: "1px solid #ccc",
  //       borderRadius: "8px",
  //       padding: "1rem",
  //       marginBottom: "1rem",
  //       boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  //     }}
  //   >
  //     <h2
  //       onClick={toggleCollapsed}
  //       style={{
  //         marginBottom: "1rem",
  //         cursor: "pointer",
  //         userSelect: "none",
  //       }}
  //     >
  //       {title} {collapsed ? "▶" : "▼"}
  //     </h2>

  //     {!collapsed && (
  //       <>
  //         <ul style={{ listStyle: "none", padding: 0 }}>
  //           {meals.map((meal, index) => (
  //             <Meal meal={meal} day={DAYS_OF_WEEK[index]} key={index} />
  //           ))}
  //         </ul>

  //         <button
  //           onClick={toggleShoppingList}
  //           style={{
  //             marginTop: "1rem",
  //             padding: "0.5rem 1rem",
  //             borderRadius: "4px",
  //             border: "1px solid #999",
  //             background: "#f9f9f9",
  //             cursor: "pointer",
  //           }}
  //         >
  //           {showShoppingList ? "Hide Shopping List" : "Show Shopping List"}
  //         </button>

  //         {showShoppingList && (
  //           <ShoppingList ingredientCounts={ingredientCounts} />
  //         )}
  //       </>
  //     )}
  //   </div>
  // );
}
