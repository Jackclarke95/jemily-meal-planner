import { Text } from "@fluentui/react";
import Page from "../Page";
import { MealType } from "../../Types/MealType";
import { MEAL_PLURAL_LOOKUP } from "../../Utils/Consts/MEAL_PLURAL_LOOKUP";

interface MealPlansProps {
  mealType: MealType;
}

const MealPlans: React.FC<MealPlansProps> = (props) => {
  return (
    <Page title={`Manage ${MEAL_PLURAL_LOOKUP[props.mealType]}`} backPath="/">
      <Text>Here you can manage your meal plans to suit your needs.</Text>
    </Page>
  );
};

export default MealPlans;
