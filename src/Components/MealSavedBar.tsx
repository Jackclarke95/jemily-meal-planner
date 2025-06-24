import {
  MessageBar,
  MessageBarType,
  ProgressIndicator,
  Stack,
} from "@fluentui/react";

interface MealSavedBarProps {
  visible: boolean;
  progress: number;
  onDismiss: () => void;
}

const MealSavedBar: React.FC<MealSavedBarProps> = ({
  visible,
  progress,
  onDismiss,
}) => {
  if (!visible) return null;
  return (
    <Stack
      styles={{
        root: {
          position: "fixed",
          top: 32,
          left: "50%",
          transform: "translateX(-50%)",
          minWidth: 280,
          maxWidth: 400,
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          borderRadius: 8,
          zIndex: 1100,
          background: "transparent",
          pointerEvents: "none",
        },
      }}
    >
      <MessageBar
        messageBarType={MessageBarType.success}
        isMultiline={false}
        onDismiss={onDismiss}
        dismissButtonAriaLabel="Close"
        styles={{
          root: {
            borderRadius: 8,
            overflow: "hidden",
            pointerEvents: "auto",
          },
        }}
      >
        Meal saved!
        <ProgressIndicator
          barHeight={2}
          percentComplete={progress}
          styles={{ root: { margin: 0, padding: 0 } }}
        />
      </MessageBar>
    </Stack>
  );
};

export default MealSavedBar;
