import { useEffect, useState } from "react";

import axios from "axios";

import { db } from "./firebase";

import {
  collection,
  getDocs,
} from "firebase/firestore";

export default function App() {

  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState([]);

  const [search, setSearch] = useState("");

  const [phone, setPhone] = useState("");

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const querySnapshot = await getDocs(
          collection(db, "product")
        );

        const items = [];

        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setProducts(items);

      } catch (error) {

        console.log(error);

      }
    };

    fetchProducts();

  }, []);

  // SEARCH
  const filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // ADD TO CART
  const addToCart = (product) => {

    setCart([...cart, product]);

    alert(product.name + " added to cart 🛒");
  };

  // REMOVE
  const removeFromCart = (indexToRemove) => {

    setCart(
      cart.filter(
        (_, index) => index !== indexToRemove
      )
    );
  };

  // TOTAL
  const totalPrice = cart.reduce(
    (total, item) => total + item.price,
    0
  );

  // MPESA PAYMENT
  const handleMpesaPayment = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/stkpush",
        {
          phone,
          amount: totalPrice,
        }
      );

      console.log(response.data);

      alert("M-Pesa request sent successfully 🔥");

    } catch (error) {

      console.log(error);

      alert("Payment failed");

    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* NAVBAR */}
      <nav className="bg-green-600 text-white p-5 flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          🟢 Mali Tap
        </h1>

        <div className="flex gap-6">
          <p>Home</p>
          <p>Products</p>
          <p>Contact</p>
        </div>

      </nav>

      {/* HERO */}
      <div className="bg-white py-20 text-center shadow">

        <h1 className="text-5xl font-bold text-green-600">
          Satisfaction Over Price
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Electronics, Furniture, Agro Products,
          Home Essentials & More
        </p>

      </div>

      {/* SEARCH */}
      <div className="p-10">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full p-4 rounded-xl border text-lg"
        />

      </div>

      {/* CART */}
      <div className="bg-white p-6 rounded-xl shadow-lg mx-10">

        <h2 className="text-3xl font-bold">
          Shopping Cart 🛒
        </h2>

        <p className="mt-3 text-lg">
          Items: {cart.length}
        </p>

        {cart.map((item, index) => (

          <div
            key={index}
            className="flex justify-between items-center border-b py-4"
          >

            <div>

              <h3 className="font-bold text-lg">
                {item.name}
              </h3>

              <p>Ksh {item.price}</p>

            </div>

            <button
              onClick={() =>
                removeFromCart(index)
              }
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Remove
            </button>

          </div>

        ))}

        <h3 className="text-2xl font-bold mt-5 text-green-600">
          Total: Ksh {totalPrice}
        </h3>

        {/* PHONE INPUT */}

        <input
          type="text"
          placeholder="Enter M-Pesa Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          className="w-full p-4 border rounded-xl mt-5"
        />

        {/* MPESA BUTTON */}

        <button
          onClick={handleMpesaPayment}
          className="bg-green-600 text-white px-6 py-4 rounded-xl mt-5 w-full text-xl"
        >
          Pay with M-Pesa
        </button>

      </div>

      {/* PRODUCTS */}
      <div className="p-10">

        <h2 className="text-4xl font-bold text-center mb-10">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {filteredProducts.map((product) => (

            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition"
            >

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-60 object-cover"
              />

              <div className="p-5">

                <h2 className="text-2xl font-bold">
                  {product.name}
                </h2>

                <p className="text-green-600 text-2xl mt-3">
                  Ksh {product.price}
                </p>

                <div className="flex gap-3 mt-5">

                  <button
                    onClick={() =>
                      addToCart(product)
                    }
                    className="bg-green-600 text-white px-4 py-3 rounded-lg w-full text-lg"
                  >
                    Add To Cart
                  </button>

                  <a
                    href={`https://wa.me/254797122585?text=Hello%20Mali%20Tap,%20I%20want%20to%20buy%20${product.name}`}
                    target="_blank"
                    className="bg-black text-white px-4 py-3 rounded-lg w-full text-lg text-center"
                  >
                    WhatsApp
                  </a>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white text-center p-6 mt-10">

        <h2 className="text-2xl font-bold">
          Mali Tap
        </h2>

        <p className="mt-2">
          Satisfaction Over Price
        </p>

      </footer>

    </div>
  );
}