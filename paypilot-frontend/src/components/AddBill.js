import React, { useState, useEffect } from "react";
import axios from "axios";
const AddBill = () => {
  const [billData, setBillData] = useState({
    title: "",
    category: "",
    amount: "",
    dueDate: "",
    userId: JSON.parse(localStorage.getItem("user"))?.id || null,
    isRecurring: false,
    frequency: "ONCE",
    isPaid: false,
    snoozeReminders: false,
    autoPayEnabled: false,
    paymentMethod: "UPI",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9090/api/categories").then((res) => {
      setCategories(res.data);
    });
    axios.get("http://localhost:9090/api/frequencies").then((res) => {
      setFrequencies(res.data);
    });
    axios.get("http://localhost:9090/api/payment_methods").then((res) => {
      setPaymentMethods(res.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillData({
      ...billData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(billData);
      await axios.post("http://localhost:9090/api/bills", billData);
      setSuccessMessage("✅ Bill added successfully!");

      setBillData({ ...billData, 
        title: "", 
        category: "", 
        amount: "", 
        dueDate: "", 
        isRecurring: false, 
        frequency: "One Time", 
        isPaid: false, 
        snoozeReminders: false,
        autoPayEnabled: false,
        paymentMethod: "UPI",
      });

      // hide message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error adding bill:", err);
      setSuccessMessage("❌ Failed to add bill. Try again.");
    }
  };

  return (
    <div>
      <h3>Add a New Bill</h3>

      {successMessage && (
        <div className="alert alert-info mt-3" role="alert">
          {successMessage}
        </div>
      )}

      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input type="text" className="form-control" name="title" value={billData.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <select className="form-control" value={billData.category} onChange={handleChange} name="category">
            <option className="form-control" key="OTHER" >--Please choose an option--</option>
            {categories.map((category) => (
              <option className="form-control" key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Amount (₹)</label>
          <input type="number" className="form-control" name="amount" value={billData.amount} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Due Date</label>
          <input type="date" className="form-control" name="dueDate" value={billData.dueDate} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Method of Payment (Default: UPI)</label>
          <select className="form-control" name="paymentMethod" value={billData.paymentMethod} onChange={handleChange}>
            {paymentMethods.map((method) => (
              <option className="form-control" key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" name="autoPayEnabled" checked={billData.autoPayEnabled} onChange={handleChange} />
          <label className="form-check-label">Enable Auto-Pay ?</label>
        </div>
        {billData.autoPayEnabled && (
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" name="isRecurring" checked={billData.isRecurring} onChange={handleChange} />
            <label className="form-check-label">Is this a recurring bill?</label>
          </div>
        )}
        {billData.isRecurring && (
          <div className="mb-3">
            <label>Frequency</label>
            <select className="form-control" name="frequency" value={billData.frequency} onChange={handleChange}>
              {frequencies.map((freq) => (
                <option className="form-control" key={freq} value={freq}>
                  {freq}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" name="snoozeReminders" checked={billData.snoozeReminders} onChange={handleChange} />
          <label className="form-check-label">Snooze reminders for this bill?</label>
        </div>
        <button type="submit" onClick={handleSubmit} className="btn btn-success">➕ Add Bill</button>
      </form>
    </div>
  );
};

export default AddBill;