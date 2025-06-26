import { useEffect, useState } from "react";
import {
  Stack,
  ShimmeredDetailsList,
  IColumn,
  SelectionMode,
  PrimaryButton,
} from "@fluentui/react";
import { ref, onValue } from "firebase/database";
import { db } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import Page from "../Page";
import { Meal } from "../../Types/Meal";
import { MealTypeEnum, MealType } from "../../Types/MealType";
import { MEAL_PLURAL_LOOKUP } from "../../Utils/Consts/MEAL_TYPE_LOOKUP";

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

  const columns: IColumn[] = [
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 120,
      isResizable: true,
    },
    {
      key: "servings",
      name: "Servings",
      fieldName: "servings",
      minWidth: 80,
      onRender: (item: Meal) => (
        <div style={{ textAlign: "center", width: "100%" }}>
          {item.servings}
        </div>
      ),
    },
  ];

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
    <Page title="Meals" backPath="/">
      <Stack tokens={{ childrenGap: 24 }}>
        <Stack horizontal horizontalAlign="end">
          <PrimaryButton
            text="Add meal"
            iconProps={{ iconName: "Add" }}
            onClick={() =>
              navigate(
                props.mealType === MealTypeEnum.Lunch
                  ? "/add-lunch"
                  : "/add-dinner"
              )
            }
          />
        </Stack>
        <ShimmeredDetailsList
          items={meals}
          columns={columns}
          setKey="set"
          selectionMode={SelectionMode.none}
          styles={{ root: { background: "#fff", borderRadius: 8, padding: 8 } }}
          onActiveItemChanged={onRowClick}
          enableShimmer={loading}
        />
      </Stack>
    </Page>
  );
};

export default Meals;
