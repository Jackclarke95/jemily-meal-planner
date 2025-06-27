import { useEffect, useState } from "react";
import { auth } from "./lib/firebase";
import Home from "./Components/Pages/Home";
import Login from "./Components/Login";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router";
import AddMeal from "./Components/Pages/AddMeal";
import Meals from "./Components/Pages/Meals";
import EditMeal from "./Components/Pages/EditMeal";
import AddMealPlan from "./Components/Pages/AddMealPlan";
import { MealTypes } from "./Types/MealType";
import MealPlans from "./Components/Pages/MealPlans";

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
    { path: "/lunches", element: <Meals mealType={MealTypes.Lunch} /> },
    { path: "/dinners", element: <Meals mealType={MealTypes.Dinner} /> },
    { path: "/add-lunch", element: <AddMeal mealType={MealTypes.Lunch} /> },
    { path: "/add-dinner", element: <AddMeal mealType={MealTypes.Dinner} /> },
    {
      path: "/edit-lunch/:id",
      element: <EditMeal mealType={MealTypes.Lunch} />,
    },
    {
      path: "/edit-dinner/:id",
      element: <EditMeal mealType={MealTypes.Dinner} />,
    },
    { path: "/lunch-plans", element: <MealPlans mealType={MealTypes.Lunch} /> },
    {
      path: "/dinner-plans",
      element: <MealPlans mealType={MealTypes.Dinner} />,
    },
    {
      path: "/add-lunch-plan",
      element: <AddMealPlan mealType={MealTypes.Lunch} />,
    },
    {
      path: "/add-dinner-plan",
      element: <AddMealPlan mealType={MealTypes.Dinner} />,
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default App;
