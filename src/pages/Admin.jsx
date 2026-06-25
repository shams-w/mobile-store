import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

export default function Admin() {
  const [name,setName] = useState("");
  const [price,setPrice] = useState("");

  const addProduct = async () => {
    await addDoc(collection(db,"products"),{
      name,
      price:Number(price),
      brand:"Apple",
      category:"flagship",
      img:"📱",
      rating:4.8,
      reviews:0,
      inStock:true,
    });

    alert("Added");
  };

  return (
    <div style={{padding:40}}>
      <h2>Admin Dashboard</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <input
        placeholder="Price"
        value={price}
        onChange={(e)=>setPrice(e.target.value)}
      />

      <button onClick={addProduct}>
        Add Product
      </button>
    </div>
  );
}