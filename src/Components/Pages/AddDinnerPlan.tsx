import Page from "../Page";
import MealPlanBuilder from "../MealPlanBuilder";
import { MealTypes } from "../../Types/MealType";

const AddDinnerPlans = () => (
  <Page title="Add Dinner Plan" backPath="/">
    <MealPlanBuilder
      mealType={MealTypes.Dinner}
      planDbPath="dinner-plans"
      title="Add Dinner Plan"
      selectLabel="Select Dinners:"
      noMealsText="No dinners selected yet."
    />
  </Page>
);

export default AddDinnerPlans;
