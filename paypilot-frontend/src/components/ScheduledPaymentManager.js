import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ScheduledPaymentManager = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [bills, setBills] = useState([]);
  const [scheduledPayments, setScheduledPayments] = useState([]);
  const [newFormData, setNewFormData] = useState({
    billId: "",
    amount: "",
    paymentMethod: "",
    scheduledDate: new Date().toISOString().split("T")[0], // default = today
    isPaid : false
  });
  const [viewType, setViewType] = useState("all");

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    fetchScheduledPayments();
  }, [viewType, scheduledPayments.isPaid]);

  const fetchBills = async () => {
    try {
      const res = await axios.get(`http://localhost:9090/api/bills/${user.id}`);
      setBills(res.data);
      console.log("Fetched bills:", res.data);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  const fetchScheduledPayments = async () => {
    try {
      let res;
      if (viewType === "all") {
        res = await axios.get(
          `http://localhost:9090/api/scheduled-payments/user/${user.id}`
        );
      } else if (viewType === "upcoming") {
        res = await axios.get(
          `http://localhost:9090/api/scheduled-payments/upcoming/${user.id}`
        );
      } else {
        res = await axios.get(
          `http://localhost:9090/api/scheduled-payments/history/${user.id}`
        );
      }
      const data = res.data;
      // console.log("Fetched scheduled payments:", data);
      setScheduledPayments(data);
    } catch (err) {
      console.error("Error fetching scheduled payments:", err);
    }
  };

  const handleChange = (e) => {
    setNewFormData({ ...newFormData, [e.target.name]: e.target.value });
    console.log("Form data:", newFormData);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", newFormData);
    try {
      if (newFormData.billId) {
        // Update existing payment
        console.log("add scheduled payment");
        if(!window.confirm("Are you sure you want to add a new scheduled payment? This will not change the bill preferences, if already scheduled payment is there then just mark it as paid to skip the payment cycle")){
          return;
        }
        await axios.post(
          `http://localhost:9090/api/scheduled-payments`,
          {
            ...newFormData,
            userId: user.id,
          }
        );
        toast.success("Scheduled Payment added successfully !!");
      } else {
        // window.alert("Select a Bill !!");
        toast.error("No bill is selected !!");
      }

      fetchScheduledPayments();
      resetForm();
    } catch (err) {
      console.error("Error saving payment:", err);
    }
  };

  const handleEdit = (payment) => {
    setNewFormData({
      id: payment.id,
      billId: payment.billId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      scheduledDate: payment.scheduledDate,
      isPaid: payment.isPaid
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment? Your payments will not be auto shceduled if this Bill has recurring cycle!!"))
      return;
    try {
      await axios.delete(`http://localhost:9090/api/scheduled-payments/${id}`);
      fetchScheduledPayments();
    } catch (err) {
      console.error("Error deleting payment:", err);
    }
  };
  const handleMarkAsPaid = async (id) => {
    if (!window.confirm("Are you sure you want to mark this payment as paid?"))
      return;
    try {
      await axios.put(
        `http://localhost:9090/api/scheduled-payments/markPaid/${id}`
      );
      fetchScheduledPayments();
    } catch (err) {
      console.error("Error marking payment as paid:", err);
    }
  };
  const resetForm = () => {
    setNewFormData({
      id: null,
      billId: "",
      amount: "",
      paymentMethod: "",
      scheduledDate: new Date().toISOString().split("T")[0],
      isPaid: false
    });
  };

  return (
    <div className="container mt-4">
      <h3>💳 {newFormData.id ? "Edit Payment" : "Schedule a Payment"}</h3>

      <form className="row g-3 align-items-end" onSubmit={handleScheduleSubmit}>
        <div className="col-md-3">
          <label className="form-label">Bill</label>
          <select
            className="form-select"
            name="billId"
            value={newFormData.billId}
            onChange={handleChange}
            required
          >
            <option value="">-- select bill --</option>
            {bills.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} (₹{b.amount})
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">Amount</label>
          <input
            type="number"
            name="amount"
            className="form-control"
            value={newFormData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Payment Method</label>
          <input
            type="text"
            name="paymentMethod"
            className="form-control"
            value={newFormData.paymentMethod}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="scheduledDate"
            className="form-control"
            value={newFormData.scheduledDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-2 d-flex">
          <button type="submit" className="btn btn-primary w-100 me-2">
            {newFormData.id ? "Update" : "Schedule"}
          </button>
          {newFormData.id && (
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr className="my-4" />

      <div className="btn-group mb-3">
        <button
          className={`btn ${
            viewType === "all" ? "btn-secondary" : "btn-outline-secondary"
          }`}
          onClick={() => setViewType("all")}
        >
          All
        </button>
        <button
          className={`btn ${
            viewType === "upcoming" ? "btn-info" : "btn-outline-info"
          }`}
          onClick={() => setViewType("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`btn ${
            viewType === "history" ? "btn-warning" : "btn-outline-warning"
          }`}
          onClick={() => setViewType("history")}
        >
          History
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bill</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {scheduledPayments.map((sp) => (
            <tr key={sp.id}>
              <td>{sp.id}</td>
              <td>
                {bills.find((b) => b.id === sp.billId)?.title || sp.billId}
              </td>
              <td>₹{sp.amount}</td>
              <td>{sp.paymentMethod}</td>
              <td>{sp.scheduledDate}</td>
              <td>
                { !sp.isPaid && 
                (<button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => handleEdit(sp)}
                >
                  Edit
                </button>)
                }
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(sp.id)}
                >
                  Delete
                </button>
                {sp.isPaid && (
                  <button className="btn btn-sm btn-success ms-2" disabled>
                    ✅ Paid
                  </button>
                )}
                {!sp.isPaid && (
                  <button
                    className="btn btn-sm btn-success ms-2"
                    onClick={() => handleMarkAsPaid(sp.id)}
                  >
                    Mark as Paid 
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduledPaymentManager;