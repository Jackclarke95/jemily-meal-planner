import { useEffect, useState } from "react";
import { auth } from "./lib/firebase";
import Home from "./Components/Pages/Home";
import Login from "./Components/Login";
import { Stack, Text, IconButton } from "@fluentui/react";
import {
  createBrowserRouter,
  Navigate,
  RouteObject,
  RouterProvider,
} from "react-router";
import { useNavigate, useLocation } from "react-router-dom";
import SignOutButton from "./Components/SignOutButton";
import AddMeal from "./Components/Pages/AddMeal";

const App = () => {
  const [user, setUser] = useState(() => auth.currentUser);

  // Set user when auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);

    return unsubscribe;
  }, [auth]);

  if (!user) {
    return <Login />;
  }

  const routes: RouteObject[] = [
    {
      path: "/",
      element: <Home user={user} />,
    },
    { path: "/add-meal", element: <AddMeal /> },
  ];

  const router = createBrowserRouter(routes);

  // Custom header with back button
  const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const showBack = location.pathname !== "/";

    return (
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack horizontal verticalAlign="center">
          {showBack && (
            <IconButton
              iconProps={{ iconName: "Back" }}
              title="Back to Home"
              ariaLabel="Back to Home"
              onClick={() => navigate("/")}
              styles={{ root: { marginRight: 8 } }}
            />
          )}
        </Stack>
        <SignOutButton />
      </Stack>
    );
  };

  return <RouterProvider router={router} />;
};

export default App;
