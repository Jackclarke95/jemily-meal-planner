import { DefaultEffects, PrimaryButton, Stack, Text } from "@fluentui/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";

const Login = () => {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <Stack
      style={{
        padding: "2rem",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Stack
        style={{
          boxShadow: DefaultEffects.elevation8,
          padding: "2rem",
          borderRadius: "8px",
          backgroundColor: "#fff",
          maxWidth: "400px",
          width: "100%",
        }}
        tokens={{ childrenGap: 20 }}
      >
        <Text>Please sign in to access the meal planner.</Text>
        <PrimaryButton onClick={handleSignIn}>
          Sign in with Google
        </PrimaryButton>
      </Stack>
    </Stack>
  );
};

export default Login;
