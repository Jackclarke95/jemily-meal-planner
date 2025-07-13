import { useEffect, useState } from "react";
import { Text, Stack, Link, Spinner } from "@fluentui/react";
import Page from "../Page";
import { MealType } from "../../Types/MealType";
import { ref, onValue } from "firebase/database";
import { db } from "../../lib/firebase";
import { MealPlan } from "../../Types/MealPlan";
import { useNavigate } from "react-router-dom";

interface MealPlansProps {
  mealType: MealType;
}

const MealPlans: React.FC<MealPlansProps> = (props) => {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const plansRef = ref(db, `${props.mealType}-plans`);
    const unsub = onValue(plansRef, (snap) => {
      const data = snap.val();
      if (data) {
        setPlans(
          Object.entries(data).map(([id, plan]: [string, any]) => ({
            ...plan,
            id,
          }))
        );
      } else {
        setPlans([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [props.mealType]);

  return (
    <Page title={`Manage ${props.mealType} plans`} backPath="/">
      <Text>Here you can manage your meal plans to suit your needs.</Text>
      {loading ? (
        <Spinner label="Loading plans..." />
      ) : (
        <Stack
          tokens={{ childrenGap: 12 }}
          styles={{ root: { marginTop: 24 } }}
        >
          {plans.length === 0 && <Text>No meal plans found.</Text>}
          {plans.map((plan) => (
            <Stack
              key={plan.id}
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              styles={{
                root: { padding: 8, border: "1px solid #eee", borderRadius: 6 },
              }}
            >
              <Text variant="large">{plan.name}</Text>
              <Link
                onClick={() =>
                  navigate(`/edit-${props.mealType}-plan/${plan.id}`)
                }
              >
                Edit
              </Link>
            </Stack>
          ))}
        </Stack>
      )}
    </Page>
  );
};

export default MealPlans;
