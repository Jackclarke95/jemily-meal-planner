import { Stack } from "@fluentui/react";
import { User } from "firebase/auth";
import NavCard from "../NavCard";
import Page from "../Page";

interface HomePageProps {}

const Home: React.FC<HomePageProps> = () => {
  return (
    <Page title="Meal Planner">
      <Stack tokens={{ childrenGap: 20 }}>
        <Stack horizontal style={{ gap: "2rem" }}>
          <NavCard
            title="Add Meal"
            description="Create a new meal"
            path={"/add-meal"}
          />
          <NavCard
            title="View Meals"
            description="Browse existing meals"
            path={"/meals"}
          />
        </Stack>
        <Stack horizontal style={{ gap: "2rem" }}>
          <NavCard
            title="Lunch Plans"
            description="View weekly lunch plans"
            path={"/lunch-plans"}
          />
          <NavCard
            title="Dinner Plans"
            description="View weekly dinner plans"
            path={"/dinner-plans"}
          />
        </Stack>
      </Stack>
    </Page>
  );
};

export default Home;
