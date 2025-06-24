import { IconButton, Stack, Text } from "@fluentui/react";
import { ReactNode } from "react";
import { useNavigate } from "react-router";
import SignOutButton from "./SignOutButton";

interface PageProps {
  children: ReactNode;
  title: string;
  path?: string;
}

const Page: React.FC<PageProps> = (props) => {
  const navigate = useNavigate();
  // Add shared components (e.g., header, footer, notifications) here if needed
  return (
    <Stack
      styles={{
        root: {
          minHeight: "100vh",
          width: "100%",
          background: "#faf9f8",
          padding: "16px",
        },
      }}
      tokens={{ childrenGap: 24 }}
    >
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <IconButton
          iconProps={{ iconName: props.path ? "Back" : "Home" }}
          title="Back to Home"
          ariaLabel="Back to Home"
          onClick={() => navigate(props.path || "/")}
          styles={{ root: { marginRight: 8 } }}
        />
        <Text variant="xLargePlus">{props.title}</Text>
        <SignOutButton />
      </Stack>

      {props.children}
    </Stack>
  );
};

export default Page;
