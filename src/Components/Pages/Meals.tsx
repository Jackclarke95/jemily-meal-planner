import { useEffect, useState } from "react";
import { Stack, IColumn, PrimaryButton } from "@fluentui/react";
import { ref, onValue } from "firebase/database";
import { db } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import Page from "../Page";
import { Meal } from "../../Types/Meal";
import { MealTypes, MealType } from "../../Types/MealType";
import { MEAL_PLURAL_LOOKUP } from "../../Utils/Consts/MEAL_PLURAL_LOOKUP";
import MealCard from "../MealCard";

interface MealsProps {
  mealType: MealType;
}

const Meals: React.FC<MealsProps> = (props) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Handler for row click
  const onRowClick = (item?: Meal) => {
    if (item && item.id) {
      navigate(`/edit-${props.mealType}/${item.id}`);
    }
  };

  useEffect(() => {
    setLoading(true);
    const mealsRef = ref(db, MEAL_PLURAL_LOOKUP[props.mealType]);
    const unsubscribe = onValue(mealsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const mealList = Object.entries(data).map(
          ([id, meal]: [string, any]) => ({
            ...meal,
            id,
            key: id,
            ingredients: meal.ingredients ?? [],
          })
        );
        setMeals(mealList);
      } else {
        setMeals([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [props.mealType, navigate]);

  return (
    <Page title={"Meals"} backPath="/">
      <Stack tokens={{ childrenGap: 24 }} styles={{ root: { width: "100%" } }}>
        <Stack horizontal horizontalAlign="end">
          <PrimaryButton
            text="Add meal"
            iconProps={{ iconName: "Add" }}
            onClick={() =>
              navigate(
                props.mealType === MealTypes.Lunch
                  ? "/add-lunch"
                  : "/add-dinner"
              )
            }
          />
        </Stack>
        {meals.length !== 0 &&
          !loading &&
          meals.map((meal) => <MealCard meal={meal} key={meal.id} />)}
      </Stack>
    </Page>
  );
};

export default Meals;
