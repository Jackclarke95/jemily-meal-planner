import React, { useState } from "react";
import { MealType } from "../../Types/Meal";
import { VscChecklist } from "react-icons/vsc";

type MealProps = {
  meal: MealType;
  day?: string;
};

const Meal: React.FC<MealProps> = ({ meal, day }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <li
      style={{
        borderBottom: "1px solid #eee",
        padding: "0.5rem 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {day && <strong>{day}</strong>} <span>{meal.name}</span>
        </div>
        {meal.ingredients.length > 0 && (
          <button
            onClick={() => setCollapsed((c) => !c)}
            style={{
              marginLeft: "1rem",
              padding: "0.2rem 0.6rem",
              fontSize: "0.9rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: "#f9f9f9",
              cursor: "pointer",
            }}
          >
            {collapsed ? "Show" : "Hide"} Ingredients
          </button>
        )}
      </div>
      {!collapsed && meal.ingredients.length > 0 && (
        <ul style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
          {meal.ingredients.map((ingredient, idx) => (
            <li key={idx} style={{ fontSize: "0.9rem", color: "#555" }}>
              • {ingredient.name} — {ingredient.quantity} {ingredient.unit}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Meal;
