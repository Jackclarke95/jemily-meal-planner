import { DefaultEffects, PrimaryButton, Stack, Text } from "@fluentui/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Lib/firebase";
import { useEffect, useState } from "react";

const Login = () => {
  const [user, setUser] = useState(() => auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  if (user) {
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
          <Text>You are already signed in.</Text>
          <PrimaryButton
            href="/"
            iconProps={{ iconName: "Home" }}
            style={{ fontSize: "1.25rem", height: 48 }}
            text="Go to Home"
          />
        </Stack>
      </Stack>
    );
  }

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
