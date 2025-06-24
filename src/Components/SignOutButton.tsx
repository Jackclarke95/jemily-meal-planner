import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { IconButton, PrimaryButton } from "@fluentui/react";

const SignOutButton = () => {
  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <IconButton onClick={handleSignOut} iconProps={{ iconName: "SignOut" }} />
  );
};

export default SignOutButton;
