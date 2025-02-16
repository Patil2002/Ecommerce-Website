import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { FaMobileAlt, FaTv, FaShoppingCart } from "react-icons/fa";
import "./App.css";

// Sample Product Data
const products = {
  Mobiles: {
      Samsung: [
          { id: 1, name: "Samsung Galaxy S23", price: 999, description: "Latest flagship from Samsung.", image: `${process.env.PUBLIC_URL}/images/samsung-s23.jpg` },
          { id: 2, name: "Samsung Galaxy A54", price: 499, description: "Mid-range smartphone from Samsung.", image: `${process.env.PUBLIC_URL}/images/samsung-a54.jpeg` }
      ],
      Apple: [
          { id: 3, name: "iPhone 14", price: 1099, description: "Apple’s latest iPhone.", image: `${process.env.PUBLIC_URL}/images/iphone-14.jpeg` },
          { id: 4, name: "iPhone SE", price: 599, description: "Affordable Apple smartphone.", image: `${process.env.PUBLIC_URL}/images/iphone-se.jpeg` }
      ]
  },
  Electronics: {
      LG: [
          { id: 5, name: "LG Washing Machine", price: 499, description: "High-efficiency front-load washing machine.", image: `${process.env.PUBLIC_URL}/images/lg-washing-machine.jpeg` }
      ],
      Samsung: [
          { id: 6, name: "Samsung Fridge", price: 699, description: "Energy-efficient fridge.", image: `${process.env.PUBLIC_URL}/images/samsung-fridge.jpeg` }
      ]
  }
};

// Sidebar Component

function Sidebar({ selectedCategory, setSelectedCategory, selectedBrand, setSelectedBrand, cart }) {
  const navigate = useNavigate();

  const toggleDropdown = (category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
    setSelectedBrand(null); // Reset brand selection
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    navigate("/"); // Ensure that navigation happens properly
  };

  return (
    <div className="sidebar">
      <h2>Categories</h2>
      <ul>
        {Object.keys(products).map((category) => (
          <li key={category}>
            <button onClick={() => toggleDropdown(category)}>
              {category === "Mobiles" ? <FaMobileAlt /> : <FaTv />} {category}
            </button>
            {selectedCategory === category && (
              <ul className="dropdown">
                {Object.keys(products[category]).map((brand) => (
                  <li key={brand}>
                    <button onClick={() => handleBrandClick(brand)}>{brand}</button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Cart Section */}
      <div className="cart">
        <h3>
          <FaShoppingCart /> Cart
        </h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-image" />
              <p>{item.name} - ${item.price} × {item.quantity}</p>
            </div>
          ))
        )}
        <button onClick={() => navigate("/cart")} className="view-cart">View Full Cart</button>
      </div>
    </div>
  );
}


// Product List Page
function ProductList({ selectedCategory,selectedBrand  }) {
  if (!selectedCategory || !selectedBrand){
     return(
      <div className="info">
    <h2>Ecommerce-Website</h2>
    </div>
     );
    }
    const brandProducts = products[selectedCategory][selectedBrand];

  return (
    <div className="main-content">
    <h1>
        {selectedBrand} {selectedCategory}
    </h1>
    <div className="products">
    {brandProducts.map((product) => (
       <div className="product-card" key={product.id}>
        
        <img src={product.image} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <Link to={`/product/${product.id}`} className="details-link">View Details</Link>
          </div>
        ))}
    </div>
    </div>
  );
}

// Product Details Page

function ProductDetails({ products,addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  let selectedProduct = null;
  let categoryName = "";
  let brandName = "";

  if (products) {
    Object.entries(products).forEach(([category, brands]) => {
        Object.entries(brands).forEach(([brand, items]) => {
            const product = items.find((p) => p.id === parseInt(id));
            if (product) {
                selectedProduct = product;
                categoryName = category;
                brandName = brand;
            }
        });
    });
}

  if (!selectedProduct) return <h2>Product not found!</h2>;

  return (
    <div className="product-details">
    <img src={selectedProduct.image} alt={selectedProduct.name} className="product-detail-image" />
    <h1>{selectedProduct.name}</h1>
    <p><strong>Category:</strong> {categoryName}</p>
    <p><strong>Brand:</strong> {brandName}</p>
    <p><strong>Description:</strong> {selectedProduct.description}</p>
    <h3><strong>Price:</strong> ${selectedProduct.price}</h3>

          <div className="button-container">
              <button className="add-to-cart-btn" onClick={() => addToCart(selectedProduct)}>
                  Add to Cart
              </button>
              <button className="back-btn" onClick={() => navigate("/")}>
                  Go Back
              </button>
          </div>
      </div>
  );
}


// Cart Page

function Cart({ cart, removeFromCart }) {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showModal, setShowModal] = useState(false);

  const banks = ["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank"];
  const upiApps = ["PhonePe", "Google Pay", "Paytm"];

  const handleBuyNow = () => {
    setShowModal(true);
  };

  const handlePaymentChange = (e) => {
    setSelectedPayment(e.target.value);
    setSelectedOption(""); // Reset the selected option
  };

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>${item.price} × {item.quantity}</p>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
            <button onClick={handleBuyNow}>Buy Now</button>
          </div>
        ))
      )}
      <h3>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</h3>

      {/* Payment Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Select Payment Method</h2>
            <select onChange={handlePaymentChange} value={selectedPayment}>
              <option value="">Choose Payment Method</option>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
            </select>

            {/* Dropdown based on selection */}
            {selectedPayment === "card" && (
              <select onChange={(e) => setSelectedOption(e.target.value)} value={selectedOption}>
                <option value="">Select Bank</option>
                {banks.map((bank, index) => (
                  <option key={index} value={bank}>{bank}</option>
                ))}
              </select>
            )}

            {selectedPayment === "upi" && (
              <select onChange={(e) => setSelectedOption(e.target.value)} value={selectedOption}>
                <option value="">Select UPI App</option>
                {upiApps.map((app, index) => (
                  <option key={index} value={app}>{app}</option>
                ))}
              </select>
            )}

            <button 
              disabled={!selectedOption} 
              onClick={() => alert(`Payment initiated via ${selectedOption}`)}
            >
              Proceed to Pay
            </button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}



// Main App Component
function App() {
const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [cart, setCart] = useState([]);


  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} 
         selectedBrand={selectedBrand}
         setSelectedBrand={setSelectedBrand}cart={cart} removeFromCart={removeFromCart} />
        <div className="content">
          <Routes>

            <Route path="/" element={<ProductList selectedCategory={selectedCategory}  selectedBrand={selectedBrand}/>} />
            <Route path="/product/:id" element={<ProductDetails products={products} addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

