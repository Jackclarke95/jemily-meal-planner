import { useEffect, useState } from "react";
import { Stack, DetailsList, IColumn, IconButton } from "@fluentui/react";
import { ref, onValue } from "firebase/database";
import { db } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import Page from "../Page";
import { Ingredient } from "../../Types/Ingredient";

interface Meal {
  title: string;
  ingredients: Ingredient[];
  updatedAt?: string;
  [key: string]: any;
}

const columns: IColumn[] = [
  {
    key: "title",
    name: "Title",
    fieldName: "title",
    minWidth: 120,
    isResizable: true,
  },
  {
    key: "edit",
    name: "",
    minWidth: 40,
    isResizable: false,
    onRender: (item: any) => (
      <IconButton
        iconProps={{ iconName: "Edit" }}
        title="Edit"
        ariaLabel="Edit"
        onClick={() => item.onEdit()}
      />
    ),
  },
];

const Meals: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const mealsRef = ref(db, "meals");
    const unsubscribe = onValue(mealsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const mealList = Object.entries(data).map(
          ([id, meal]: [string, any]) => ({
            ...meal,
            key: id,
            onEdit: () => navigate(`/edit-meal/${id}`),
          })
        );
        setMeals(mealList);
      } else {
        setMeals([]);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <Page title="Meals" path="/">
      <Stack tokens={{ childrenGap: 24 }}>
        <DetailsList
          items={meals}
          columns={columns}
          setKey="set"
          selectionMode={0} // 0 = SelectionMode.none
          styles={{ root: { background: "#fff", borderRadius: 8, padding: 8 } }}
        />
      </Stack>
    </Page>
  );
};

export default Meals;
