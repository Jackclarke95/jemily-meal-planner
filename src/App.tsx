import { useEffect, useState } from "react";
import { auth } from "./lib/firebase";
import Home from "./Components/Pages/Home";
import Login from "./Components/Login";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router";
import AddMeal from "./Components/Pages/AddMeal";
import Meals from "./Components/Pages/Meals";
import EditMeal from "./Components/Pages/EditMeal"; // <-- Import the EditMeal page

const App = () => {
  const [user, setUser] = useState(() => auth.currentUser);

  // Set user when auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);

    return unsubscribe;
  }, []);

  if (!user) {
    return <Login />;
  }

  const routes: RouteObject[] = [
    {
      path: "/",
      element: <Home user={user} />,
    },
    { path: "/add-meal", element: <AddMeal /> },
    { path: "/meals", element: <Meals /> },
    { path: "/edit-meal/:id", element: <EditMeal /> }, // <-- Add this route
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default App;
