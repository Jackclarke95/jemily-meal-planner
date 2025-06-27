import { Text } from "@fluentui/react";
import Page from "../Page";
import { MealType } from "../../Types/MealType";

interface MealPlansProps {
  mealType: MealType;
}

const MealPlans: React.FC<MealPlansProps> = (props) => {
  return (
    <Page title="Dinner Plans" backPath="/">
      <Text>Here you can manage your dinner plans to suit your needs.</Text>
    </Page>
  );
};

export default MealPlans;
