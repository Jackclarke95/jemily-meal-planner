import { useEffect, useState } from "react";
import { Stack, Text, DetailsList, IColumn, IconButton } from "@fluentui/react";
import { ref, onValue } from "firebase/database";
import { db } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import Page from "../Page";

interface Meal {
  title: string;
  ingredients: any[];
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

const ViewMeals: React.FC = () => {
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
    <Page title="View Meals" path="/">
      <Stack tokens={{ childrenGap: 24 }}>
        <Text variant="xLargePlus">All Meals</Text>
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

export default ViewMeals;
