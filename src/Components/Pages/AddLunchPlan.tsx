import Page from "../Page";
import MealPlanBuilder from "../MealPlanBuilder";
import { MealTypes } from "../../Types/MealType";

const AddLunchPlans = () => (
  <Page title="Add Lunch Plan" backPath="/">
    <MealPlanBuilder
      mealType={MealTypes.Lunch}
      planDbPath="lunch-plans"
      title="Add Lunch Plan"
      selectLabel="Select Lunches:"
      noMealsText="No lunches selected yet."
    />
  </Page>
);

export default AddLunchPlans;
