import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API_URL = "https://fakestoreapi.com/products";

function Home({ products, addToCart, addToFavorites, setSortBy, setCategory, sortedProducts, filteredProducts }) {
  return (
    <div className="container">
      <h1 className="text-center my-4">Online Shopping</h1>
      <div className="row mb-3">
        <div className="col-md-6">
          <select className="form-select" onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price">Price</option>
          </select>
        </div>
        <div className="col-md-6">
          <select className="form-select" onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="row">
        {filteredProducts().map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img src={product.image} className="card-img-top" alt={product.title} />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">${product.price}</p>
                <button className="btn btn-primary me-2" onClick={() => addToCart(product)}>Add to Cart</button>
                <button className="btn btn-outline-danger" onClick={() => addToFavorites(product)}>❤️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cart({ cart }) {
  return (
    <div className="container">
      <h1 className="text-center my-4">Shopping Cart</h1>
      <div className="row">
        {cart.length === 0 ? <p className="text-center">Your cart is empty</p> : cart.map((product, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card h-100">
              <img src={product.image} className="card-img-top" alt={product.title} />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">${product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const addToFavorites = (product) => {
    setFavorites([...favorites, product]);
  };

  const sortedProducts = () => {
    let sorted = [...products];
    if (sortBy === "price") {
      sorted.sort((a, b) => a.price - b.price);
    }
    return sorted;
  };

  const filteredProducts = () => {
    return category ? sortedProducts().filter((p) => p.category === category) : sortedProducts();
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">Online Shop</Link>
          <Link className="nav-link" to="/cart">Cart ({cart.length})</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home products={products} addToCart={addToCart} addToFavorites={addToFavorites} setSortBy={setSortBy} setCategory={setCategory} sortedProducts={sortedProducts} filteredProducts={filteredProducts} />} />
        <Route path="/cart" element={<Cart cart={cart} />} />
      </Routes>
    </Router>
  );
}
