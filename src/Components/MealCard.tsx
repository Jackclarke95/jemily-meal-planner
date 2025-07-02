import { getTheme, Stack, Text } from "@fluentui/react";
import { Meal } from "../Types/Meal";

interface MealCardProps {
  meal: Meal;
}

const MealCard: React.FC<MealCardProps> = (props) => {
  const theme = getTheme();

  const shouldShowTags = props.meal.tags?.length > 0;

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
    >
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <Text>{props.meal.name}</Text>
        <Stack>
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
