import { useEffect, useState } from "react";
import { ref, set, onValue, push } from "firebase/database";
import { db } from "../lib/firebase";

export default function DatabaseTest() {
  const [testData, setTestData] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    const dataRef = ref(db, "testData");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTestData(Object.values(data));
      } else {
        setTestData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addItem = async () => {
    if (!newItem.trim()) return;

    const dataRef = ref(db, "testData");
    await push(dataRef, newItem.trim());
    setNewItem("");
  };

  return (
    <div
      style={{ padding: "1rem", border: "1px solid #ccc", marginTop: "2rem" }}
    >
      <h2>Database Test</h2>

      <div>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="New item"
        />
        <button onClick={addItem} style={{ marginLeft: "1rem" }}>
          Add Item
        </button>
      </div>

      <ul>
        {testData.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
