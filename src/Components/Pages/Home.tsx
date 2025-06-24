import { Stack, Text } from "@fluentui/react";
import MealPlanCard from "../MealCard/MealPlanCard";
import { User } from "firebase/auth";
import NavCard from "../NavCard";
import { MealType } from "../../Types/Meal";
import Page from "../Page";

interface HomePageProps {
  user: User;
}

const Home: React.FC<HomePageProps> = (props) => {
  const eveningMeals: MealType[] = [
    {
      name: "Spaghetti Bolognese",
      ingredients: [
        { name: "Spaghetti", quantity: "200", unit: "grams" },
        { name: "Beef mince", quantity: "500", unit: "grams" },
        { name: "Tomato sauce", quantity: "1", unit: "can" },
        { name: "Onion", quantity: "1", unit: "individual" },
        { name: "Garlic", quantity: "3", unit: "cloves" },
      ],
    },
    {
      name: "Chicken Stir Fry",
      ingredients: [
        { name: "Chicken breast", quantity: "2", unit: "individual" },
        { name: "Mixed vegetables", quantity: "300", unit: "grams" },
        { name: "Soy sauce", quantity: "50", unit: "ml" },
        { name: "Rice", quantity: "200", unit: "grams" },
        { name: "Onion", quantity: "1", unit: "individual" },
      ],
    },
  ];

  const lunches = [
    {
      name: "Spaghetti Bolognese",
      ingredients: [
        { name: "Spaghetti", quantity: "200", unit: "grams" },
        { name: "Beef mince", quantity: "500", unit: "grams" },
        { name: "Tomato sauce", quantity: "1", unit: "can" },
        { name: "Onion", quantity: "200", unit: "grams" },
        { name: "Garlic", quantity: "3", unit: "cloves" },
      ],
    },
    {
      name: "Chicken Stir Fry",
      ingredients: [
        { name: "Chicken breast", quantity: "2", unit: "individual" },
        { name: "Mixed vegetables", quantity: "300", unit: "grams" },
        { name: "Soy sauce", quantity: "50", unit: "ml" },
        { name: "Rice", quantity: "200", unit: "grams" },
        { name: "Onion", quantity: "1", unit: "individual" },
      ],
    },
  ];

  return (
    <Page title="Home">
      <Stack tokens={{ childrenGap: 20 }}>
        <Text variant="large">This week's meals</Text>
        <Stack horizontal style={{ gap: "2rem" }}>
          <NavCard
            title="Add Meal"
            description="Create a new meal"
            path={"/add-meal"}
          />
          <MealPlanCard title="Evening Meals" meals={eveningMeals} />
          <MealPlanCard title="Lunches" meals={lunches} />
        </Stack>
      </Stack>
    </Page>
  );
};

export default Home;
