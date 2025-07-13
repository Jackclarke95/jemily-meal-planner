import { MessageBar, MessageBarType, Stack } from "@fluentui/react";
import Page from "../Page";

const MealPlans: React.FC = (props) => {
  return (
    <Page title="Meal plans" backPath="/">
      <Stack tokens={{ childrenGap: 20 }}>
        <MessageBar
          messageBarType={MessageBarType.severeWarning}
          isMultiline={false}
        >
          Page under construction
        </MessageBar>
      </Stack>
    </Page>
  );
};

export default MealPlans;
