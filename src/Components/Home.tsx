import { Stack } from "@fluentui/react";
import DatabaseTest from "./DatabaseTest";
import MealPlanCard from "./MealCard/MealPlanCard";
import { User } from "firebase/auth";
import SignOutButton from "./SignOutButton";

interface HomeProps {
  user: User;
}

const Home: React.FC<HomeProps> = (props) => {
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

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Jemily Meal Planner</h1>
      <SignOutButton />
      <h3>This week's meals</h3>
      <Stack horizontal style={{ gap: "2rem" }}>
        <MealPlanCard title="Evening Meals" meals={eveningMeals} />
        <MealPlanCard title="Lunches" meals={lunches} />
      </Stack>
      <DatabaseTest />
    </div>
  );
};

export default Home;
