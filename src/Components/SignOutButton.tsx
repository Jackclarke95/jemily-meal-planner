import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { PrimaryButton } from "@fluentui/react";

const SignOutButton = () => {
  const handleSignOut = async () => {
    await signOut(auth);
  };

  return <PrimaryButton onClick={handleSignOut}>Sign Out</PrimaryButton>;
};

export default SignOutButton;
