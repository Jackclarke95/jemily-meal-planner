import React, { useState } from "react";

type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

type Meal = {
  name: string;
  ingredients: Ingredient[];
};

type MealPlanCardProps = {
  title: string;
  meals: Meal[]; // Should be length 7
};

export default function MealPlanCard({ title, meals }: MealPlanCardProps) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [collapsed, setCollapsed] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleShoppingList = () => {
    setShowShoppingList((prev) => !prev);
  };

  // Collate: { "onion": { "individual": 1, "grams": 200 } }
  const collateIngredients = (): {
    [ingredient: string]: { [unit: string]: number };
  } => {
    const ingredientMap: { [ingredient: string]: { [unit: string]: number } } =
      {};

    meals.forEach((meal) => {
      meal.ingredients.forEach((ingredient) => {
        const nameKey = ingredient.name.trim().toLowerCase();
        const unitKey = ingredient.unit.trim().toLowerCase();

        if (!ingredientMap[nameKey]) {
          ingredientMap[nameKey] = {};
        }

        if (ingredientMap[nameKey][unitKey]) {
          ingredientMap[nameKey][unitKey] += ingredient.quantity;
        } else {
          ingredientMap[nameKey][unitKey] = ingredient.quantity;
        }
      });
    });

    return ingredientMap;
  };

  const ingredientCounts = collateIngredients();

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        onClick={toggleCollapsed}
        style={{
          marginBottom: "1rem",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {title} {collapsed ? "▶" : "▼"}
      </h2>

      {!collapsed && (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {meals.map((meal, index) => (
              <li
                key={index}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "0.5rem 0",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>{days[index]}</strong>
                  <span>{meal.name}</span>
                </div>
                {meal.ingredients.length > 0 && (
                  <ul style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
                    {meal.ingredients.map((ingredient, idx) => (
                      <li
                        key={idx}
                        style={{ fontSize: "0.9rem", color: "#555" }}
                      >
                        • {ingredient.name} — {ingredient.quantity}{" "}
                        {ingredient.unit}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={toggleShoppingList}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #999",
              background: "#f9f9f9",
              cursor: "pointer",
            }}
          >
            {showShoppingList ? "Hide Shopping List" : "Show Shopping List"}
          </button>

          {showShoppingList && (
            <ul style={{ marginTop: "1rem", paddingLeft: "1rem" }}>
              {Object.entries(ingredientCounts).map(
                ([ingredientName, unitMap]) => {
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
                      {ingredientName.charAt(0).toUpperCase() +
                        ingredientName.slice(1)}{" "}
                      —{" "}
                      {units.map(([unit, qty]) => `${qty} ${unit}`).join(" + ")}
                      {isConflict && " ⚠️ Conflicting units"}
                    </li>
                  );
                }
              )}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
