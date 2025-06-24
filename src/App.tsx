import { useEffect, useState } from "react";
import AuthButton from "./Components/AuthButton";
import DatabaseTest from "./Components/DatabaseTest";
import { auth } from "./lib/firebase";
import MealPlanCard from "./Components/MealCard/MealPlanCard";
import { DocumentCard } from "@fluentui/react";

function App() {
  const [user, setUser] = useState(() => auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);

    return unsubscribe;
  }, []);

  const eveningMeals = [
    {
      name: "Spaghetti Bolognese",
      ingredients: [
        { name: "Spaghetti", quantity: 200, unit: "grams" },
        { name: "Beef mince", quantity: 500, unit: "grams" },
        { name: "Tomato sauce", quantity: 1, unit: "can" },
        { name: "Onion", quantity: 1, unit: "individual" },
        { name: "Garlic", quantity: 3, unit: "cloves" },
      ],
    },
    {
      name: "Chicken Stir Fry",
      ingredients: [
        { name: "Chicken breast", quantity: 2, unit: "individual" },
        { name: "Mixed vegetables", quantity: 300, unit: "grams" },
        { name: "Soy sauce", quantity: 50, unit: "ml" },
        { name: "Rice", quantity: 200, unit: "grams" },
        { name: "Onion", quantity: 1, unit: "individual" },
      ],
    },
  ];

  const lunches = [
    {
      name: "Spaghetti Bolognese",
      ingredients: [
        { name: "Spaghetti", quantity: 200, unit: "grams" },
        { name: "Beef mince", quantity: 500, unit: "grams" },
        { name: "Tomato sauce", quantity: 1, unit: "can" },
        { name: "Onion", quantity: 200, unit: "grams" },
        { name: "Garlic", quantity: 3, unit: "cloves" },
      ],
    },
    {
      name: "Chicken Stir Fry",
      ingredients: [
        { name: "Chicken breast", quantity: 2, unit: "individual" },
        { name: "Mixed vegetables", quantity: 300, unit: "grams" },
        { name: "Soy sauce", quantity: 50, unit: "ml" },
        { name: "Rice", quantity: 200, unit: "grams" },
        { name: "Onion", quantity: 1, unit: "individual" },
      ],
    },
  ];

  if (!user) {
    <AuthButton />;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Jemily Meal Planner</h1>
      <AuthButton />
      <h3>This week's meals</h3>
      <div style={{ marginTop: "2rem", display: "flex", gap: "2rem" }}>
        <MealPlanCard title="Evening Meals" meals={eveningMeals} />
        <MealPlanCard title="Lunches" meals={lunches} />
      </div>

      {user && <DatabaseTest />}
    </div>
  );
}

export default App;
