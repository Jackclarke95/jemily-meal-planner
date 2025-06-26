import { useEffect, useState } from "react";
import { auth } from "./lib/firebase";
import Home from "./Components/Pages/Home";
import Login from "./Components/Login";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router";
import AddMeal from "./Components/Pages/AddMeal";
import Meals from "./Components/Pages/Meals";
import EditMeal from "./Components/Pages/EditMeal"; // <-- Import the EditMeal page
import LunchPlans from "./Components/Pages/LunchPlans";
import DinnerPlans from "./Components/Pages/DinnerPlans";
import AddLunchPlans from "./Components/Pages/AddLunchPlan";
import AddDinnerPlans from "./Components/Pages/AddDinnerPlan";

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
      element: <Home />,
    },
    { path: "/login", element: <Login /> },
    { path: "/lunches", element: <Meals mealType="lunch" /> },
    { path: "/dinners", element: <Meals mealType="dinner" /> },
    { path: "/add-lunch", element: <AddMeal mealType="lunch" /> },
    { path: "/add-dinner", element: <AddMeal mealType="dinner" /> },
    { path: "/edit-lunch/:id", element: <EditMeal mealType="lunch" /> },
    { path: "/edit-dinner/:id", element: <EditMeal mealType="dinner" /> },
    { path: "/lunch-plans", element: <LunchPlans /> },
    { path: "/dinner-plans", element: <DinnerPlans /> },
    { path: "/add-lunch-plan", element: <AddLunchPlans /> },
    { path: "/add-dinner-plan", element: <AddDinnerPlans /> },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default App;
