
// app/page.tsx

"use client";

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

function Input({ ...props }) {
  return <input className="border rounded p-2 w-full" {...props} />;
}

function Button({ children, ...props }) {
  return <button className="bg-blue-500 text-white rounded px-4 py-2" {...props}>{children}</button>;
}

function Card({ children }) {
  return <div className="border rounded shadow p-4">{children}</div>;
}

function TabsList({ children }) {
  return <div className="flex space-x-2">{children}</div>;
}

function TabsTrigger({ value, onClick, children }) {
  return <Button onClick={() => onClick(value)}>{children}</Button>;
}

export default function Page() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("buyer");
  const [products, setProducts] = useState([
    { id: 1, name: "Laptop", price: 800 },
    { id: 2, name: "Phone", price: 400 },
    { id: 3, name: "T-Shirt", price: 25 },
  ]);
  const [query, setQuery] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });

  const handleGoogleLogin = (credentialResponse) => {
    const userInfo = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
    setUser(userInfo);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  const handleAddProduct = () => {
    const id = products.length + 1;
    setProducts([...products, { id, ...newProduct, price: parseFloat(newProduct.price) }]);
    setNewProduct({ name: "", price: "" });
  };

  if (!user) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl mb-6">Login to Continue</h1>
        <GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert("Login Failed")} />
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mini Amazon</h1>
        <TabsList>
          <TabsTrigger value="buyer" onClick={setRole}>Buyer</TabsTrigger>
          <TabsTrigger value="seller" onClick={setRole}>Seller</TabsTrigger>
        </TabsList>
      </div>

      {role === "buyer" && (
        <div>
          <Input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <Card key={product.id}>
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p>${product.price}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {role === "seller" && (
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <Button onClick={handleAddProduct}>Add Product</Button>
        </div>
      )}
    </div>
  );
}
