import { getTheme, Stack, Text } from "@fluentui/react";
import { Meal } from "../Types/Meal";
import { useNavigate } from "react-router-dom";
import { MealType } from "../Types/MealType";

interface MealCardProps {
  meal: Meal;
  mealType: MealType;
  shouldNavigateOnClick?: boolean;
}

const MealCard: React.FC<MealCardProps> = (props) => {
  const theme = getTheme();
  const navigate = useNavigate();

  const shouldShowTags = props.meal.tags?.length > 0;

  const onMealClick = () => {
    navigate(`/edit-${props.mealType}/${props.meal.id}`);
  };

  return (
    <Stack
      style={{
        boxShadow: theme.effects.elevation8,
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        padding: "1rem",
      }}
      tokens={{ childrenGap: 10 }}
      onClick={props.shouldNavigateOnClick ? onMealClick : undefined}
    >
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <Text styles={{ root: { width: "80%" } }}>{props.meal.name}</Text>
        <Stack styles={{ root: { width: "20%" } }}>
          <Text>
            <b>Cal: </b>
            {props.meal.calories}
          </Text>
          <Text>
            <b>Servings: </b>
            {props.meal.servings}
          </Text>
        </Stack>
      </Stack>
      {shouldShowTags && (
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          {props.meal.tags.map((tag, index) => (
            <Text
              key={index}
              styles={{
                root: {
                  boxShadow: theme.effects.elevation4,
                  padding: "3px 5px",
                  backgroundColor: theme.palette.themeLighter,
                },
              }}
            >
              {tag}
            </Text>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default MealCard;
