import { Stack } from "@fluentui/react";
import NavCard from "../NavCard";
import Page from "../Page";

interface HomePageProps {}

const Home: React.FC<HomePageProps> = () => {
  return (
    <Page title="Meal Planner">
      <Stack tokens={{ childrenGap: 20 }}>
        <Stack horizontal style={{ gap: "2rem" }}>
          <NavCard
            title="Create meal plan"
            description="Create a new meal plan"
            path={"/add-meal-plan"}
          />
          <NavCard
            title="View meal plan"
            description="View your current meal plans"
            path={"/meal-plans"}
          />
        </Stack>
        <Stack horizontal style={{ gap: "2rem" }}>
          <NavCard
            title="Add lunch"
            description="Create a new lunch time meal"
            path={"/add-lunch"}
          />
          <NavCard
            title="Add dinner"
            description="Create a new dinner time meal"
            path={"/add-dinner"}
          />
        </Stack>
        <Stack horizontal style={{ gap: "2rem" }}>
          <NavCard
            title="Manage lunches"
            description="Manage lunch time meals"
            path={"/lunches"}
          />
          <NavCard
            title="Manage dinners"
            description="Manage dinner time meals"
            path={"/dinners"}
          />
        </Stack>
      </Stack>
    </Page>
  );
};

export default Home;
