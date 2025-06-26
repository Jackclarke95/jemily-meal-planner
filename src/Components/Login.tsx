import {
  DefaultEffects,
  PrimaryButton,
  Stack,
  Text,
  Image,
  DefaultButton,
} from "@fluentui/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useEffect, useState } from "react";
import AppLogo from "../Assets/Images/App Logo.png";
import GoogleLogo from "../Assets/Images/Google Logo.png";

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
            alignItems: "center",
          }}
          tokens={{ childrenGap: 24 }}
        >
          <Image
            src={AppLogo}
            alt="Meal Planner Icon"
            width={256}
            height={256}
            style={{ display: "block", margin: "0 auto", borderRadius: "32px" }}
          />
          <Text>You are already signed in.</Text>
          <PrimaryButton
            href="/"
            iconProps={{ iconName: "Home" }}
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
          alignItems: "center",
        }}
        tokens={{ childrenGap: 24 }}
      >
        <Image
          src={AppLogo}
          alt="Meal Planner Icon"
          width={256}
          height={256}
          style={{ display: "block", margin: "0 auto", borderRadius: "32px" }}
        />
        <DefaultButton
          onClick={handleSignIn}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src={GoogleLogo}
            alt="Google logo"
            style={{
              width: 18,
              height: 18,
              marginRight: 12,
              verticalAlign: "middle",
              borderRadius: "4px", // Add border radius to Google logo as well
            }}
          />
          Sign in with Google
        </DefaultButton>
      </Stack>
    </Stack>
  );
};

export default Login;
