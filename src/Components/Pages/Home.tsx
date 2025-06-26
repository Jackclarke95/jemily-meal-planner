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
            title="Add Lunch"
            description="Create a new lunch time meal"
            path={"/add-lunch"}
          />
          <NavCard
            title="Add Dinner"
            description="Create a new dinner time meal"
            path={"/add-dinner"}
          />
        </Stack>
        <Stack horizontal style={{ gap: "2rem" }}>
          <NavCard
            title="Manage Lunches"
            description="Manage lunch time meals"
            path={"/lunches"}
          />
          <NavCard
            title="Manage Dinners"
            description="Manage dinner time meals"
            path={"/dinners"}
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
        <Stack horizontal style={{ gap: "2rem" }}>
          <NavCard
            title="Add Lunch Plan"
            description="Add a weekly lunch plan"
            path={"/add-lunch-plan"}
          />
          <NavCard
            title="Add Dinner Plan"
            description="Add a weekly dinner plan"
            path={"/add-dinner-plan"}
          />
        </Stack>
      </Stack>
    </Page>
  );
};

export default Home;
