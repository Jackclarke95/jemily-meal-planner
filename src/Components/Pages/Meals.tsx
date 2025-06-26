import { useEffect, useState } from "react";
import {
  Stack,
  DetailsList,
  IColumn,
  SelectionMode,
  PrimaryButton,
} from "@fluentui/react";
import { ref, onValue } from "firebase/database";
import { db } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import Page from "../Page";
import { Meal } from "../../Types/Meal";

const Meals: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const navigate = useNavigate();

  // Handler for row click
  const onRowClick = (item?: Meal) => {
    if (item && item.id) {
      navigate(`/edit-meal/${item.id}`);
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
    const mealsRef = ref(db, "meals");
    const unsubscribe = onValue(mealsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const mealList = Object.entries(data).map(
          ([id, meal]: [string, any]) => ({
            ...meal,
            id, // Ensure id is present for navigation
            key: id,
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
    <Page title="Meals" backPath="/">
      <Stack tokens={{ childrenGap: 24 }}>
        <Stack horizontal horizontalAlign="end">
          <PrimaryButton
            text="Add meal"
            iconProps={{ iconName: "Add" }}
            onClick={() => navigate("/add-meal")}
          />
        </Stack>
        <DetailsList
          items={meals}
          columns={columns}
          setKey="set"
          selectionMode={SelectionMode.none}
          styles={{ root: { background: "#fff", borderRadius: 8, padding: 8 } }}
          onActiveItemChanged={onRowClick}
        />
      </Stack>
    </Page>
  );
};

export default Meals;
