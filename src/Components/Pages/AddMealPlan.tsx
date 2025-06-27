import Page from "../Page";
import MealPlanBuilder from "../MealPlanBuilder";
import { MealType } from "../../Types/MealType";

interface AddMealPlanProps {
  mealType: MealType;
}

const AddMealPlan: React.FC<AddMealPlanProps> = (props) => (
  <Page title={`Add ${props.mealType} plan`} backPath="/">
    <MealPlanBuilder mealType={props.mealType} />
  </Page>
);

export default AddMealPlan;
