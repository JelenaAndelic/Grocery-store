import React, { useState, useEffect } from "react";
import List from "./components/List";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};

function App() {
  const [item, setItem] = useState({
    name: "",
    quantity: 1,
    price: "",
  });
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [totalAmount, setTotalAmount] = useState(null);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setItem({ ...item, [name]: value });
  };

  const handleAmount = (e) => {
    setTotalAmount(e.target.value);
  };

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Name is required!";
    }
    if (!values.quantity) {
      errors.quantity = "Quantity is required!";
    }
    if (!values.price) {
      errors.price = "Price is required!";
    }
    return errors;
  };

  const calculate = (e) => {
    e.preventDefault();
    const totalItemCosts = list.reduce((total, stuff) => {
      total += parseInt(stuff.quantity) * parseFloat(stuff.price);
      return total;
    }, 0);
    const restOfMoney = totalAmount - totalItemCosts;

    if (restOfMoney > 0) {
      alert("The left money is " + restOfMoney);
    } else {
      alert("It is out of the budget");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(item));

    if (!item.name || !item.quantity || !item.price) {
      alert("All input are required!");
      setFormErrors({});
    } else if (item.name && item.quantity && item.price && isEditing) {
      setList(
        list.map((stuff) => {
          if (stuff.id === editID) {
            return {
              ...stuff,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            };
          }
          return stuff;
        })
      );
      setItem({ name: "", quantity: 1, price: "" });
      setEditID(null);
      setIsEditing(false);
    } else {
      const newItem = { ...item, id: new Date().getTime().toString() };
      setList([...list, newItem]);
      setItem({ name: "", quantity: 1, price: "" });
    }
  };

  const clearList = () => {
    setList([]);
  };
  const removeItem = (id) => {
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setItem(specificItem);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={calculate}>
        <h3>Budget Calculation</h3>
        <div className="form-control budget-form">
          <input
            type="number"
            name="amount"
            placeholder="e.g. 100$"
            value={totalAmount}
            onChange={handleAmount}
          />
          <button type="submit" className="submit-btn">
            calculate
          </button>
        </div>
      </form>
      <form className="grocery-form" onSubmit={handleSubmit}>
        <h3>Grocery list</h3>
        <div className="form-control">
          <div>
            <input
              type="text"
              name="name"
              className="name"
              placeholder="e.g. eggs"
              value={item.name}
              onChange={handleChange}
            />
            <div className="form__error">{formErrors.name}</div>
          </div>
          <div>
            <input
              type="number"
              name="quantity"
              className="quantity"
              value={item.quantity}
              onChange={handleChange}
            />
            <div className="form__error">{formErrors.quantity}</div>
          </div>

          <div>
            <input
              type="number"
              name="price"
              className="price"
              placeholder="e.g. 50$"
              value={item.price}
              onChange={handleChange}
            />
            <div className="form__error">{formErrors.price}</div>
          </div>

          <button type="submit" className="submit-btn">
            {isEditing ? "save" : "add"}
          </button>
        </div>
      </form>
      {list.length > 0 ? (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      ) : (
        <div className="info-message">There is no items in the list</div>
      )}
    </section>
  );
}

export default App;
