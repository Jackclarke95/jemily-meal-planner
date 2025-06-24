import React from "react";

type ShoppingListProps = {
  ingredientCounts: {
    [ingredientName: string]: { [unit: string]: number };
  };
};

const ShoppingList: React.FC<ShoppingListProps> = ({ ingredientCounts }) => (
  <ul style={{ marginTop: "1rem", paddingLeft: "1rem" }}>
    {Object.entries(ingredientCounts).map(([ingredientName, unitMap]) => {
      const units = Object.entries(unitMap);
      const isConflict = units.length > 1;

      return (
        <li
          key={ingredientName}
          style={{
            fontSize: "0.95rem",
            color: isConflict ? "red" : "black",
            fontWeight: isConflict ? "bold" : "normal",
          }}
        >
          {ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1)} —{" "}
          {units.map(([unit, qty]) => `${qty} ${unit}`).join(" + ")}
          {isConflict && " ⚠️ Conflicting units"}
        </li>
      );
    })}
  </ul>
);

export default ShoppingList;
