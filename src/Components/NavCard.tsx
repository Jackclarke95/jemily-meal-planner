import { getTheme, Stack, Text } from "@fluentui/react";
import { useNavigate } from "react-router-dom";

interface NavCardProps {
  title: string;
  description?: string;
  path: string;
}

const NavCard: React.FC<NavCardProps> = (props) => {
  const theme = getTheme();
  const navigate = useNavigate();

  const onClick = () => {
    navigate(props.path);
  };

  return (
    <Stack
      className="nav-card"
      onClick={onClick}
      style={{
        boxShadow: theme.effects.elevation8,
        width: "100%",
        textAlign: "center",
        cursor: "pointer",
        padding: "1rem",
      }}
      tokens={{ childrenGap: 10 }}
    >
      <Text variant="large">{props.title}</Text>
      {props.description && <Text>{props.description}</Text>}
    </Stack>
  );
};

export default NavCard;
