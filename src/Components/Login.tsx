import { PrimaryButton } from "@fluentui/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";

const Login = () => {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <PrimaryButton onClick={handleSignIn}>Sign in with Google</PrimaryButton>
  );
};

export default Login;
