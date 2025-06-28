import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../../lib/firebase";
import { MealPlan } from "../../Types/MealPlan";
import MealPlanBuilder from "../MealPlanBuilder";
import { MealType } from "../../Types/MealType";
import { Spinner, Text } from "@fluentui/react";
import Page from "../Page";

interface EditMealPlanProps {
  mealType: MealType;
}

const EditMealPlan: React.FC<EditMealPlanProps> = (props) => {
  const { id } = useParams();
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const planRef = ref(db, `${props.mealType}-plans/${id}`);
    get(planRef).then((snap) => {
      if (snap.exists()) {
        setPlan({ ...snap.val(), id });
      }
      setLoading(false);
    });
  }, [id, props.mealType]);

  if (loading) return <Spinner label="Loading..." />;
  if (!plan) return <Text>Meal plan not found.</Text>;

  return (
    <Page title={`Manage ${props.mealType} plan`} backPath="/">
      <MealPlanBuilder mealType={props.mealType} mealPlan={plan} />
    </Page>
  );
};

export default EditMealPlan;
