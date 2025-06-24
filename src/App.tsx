import { useEffect, useState } from "react";
import { auth } from "./lib/firebase";
import Home from "./Components/Home";
import Login from "./Components/Login";

const App = () => {
  const [user, setUser] = useState(() => auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);

    return unsubscribe;
  }, []);

  if (!user) {
    return <Login />;
  }

  const eveningMeals = [
    {
      name: "Spaghetti Bolognese",
      ingredients: [
        { name: "Spaghetti", quantity: 200, unit: "grams" },
        { name: "Beef mince", quantity: 500, unit: "grams" },
        { name: "Tomato sauce", quantity: 1, unit: "can" },
        { name: "Onion", quantity: 1, unit: "individual" },
        { name: "Garlic", quantity: 3, unit: "cloves" },
      ],
    },
    {
      name: "Chicken Stir Fry",
      ingredients: [
        { name: "Chicken breast", quantity: 2, unit: "individual" },
        { name: "Mixed vegetables", quantity: 300, unit: "grams" },
        { name: "Soy sauce", quantity: 50, unit: "ml" },
        { name: "Rice", quantity: 200, unit: "grams" },
        { name: "Onion", quantity: 1, unit: "individual" },
      ],
    },
  ];

  const lunches = [
    {
      name: "Spaghetti Bolognese",
      ingredients: [
        { name: "Spaghetti", quantity: 200, unit: "grams" },
        { name: "Beef mince", quantity: 500, unit: "grams" },
        { name: "Tomato sauce", quantity: 1, unit: "can" },
        { name: "Onion", quantity: 200, unit: "grams" },
        { name: "Garlic", quantity: 3, unit: "cloves" },
      ],
    },
    {
      name: "Chicken Stir Fry",
      ingredients: [
        { name: "Chicken breast", quantity: 2, unit: "individual" },
        { name: "Mixed vegetables", quantity: 300, unit: "grams" },
        { name: "Soy sauce", quantity: 50, unit: "ml" },
        { name: "Rice", quantity: 200, unit: "grams" },
        { name: "Onion", quantity: 1, unit: "individual" },
      ],
    },
  ];

  return <Home user={user} />;
};

export default App;
