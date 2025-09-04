import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewBills = () => {
  const [userId, setUserId] = useState(null);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      setUserId(user.id);
    }
  }, []);
  
  useEffect(() => {
    if (userId) {
      fetchBills(userId);
    }
  }, [userId]);

  const fetchBills = async (userId) => {
    const res = await axios.get(`http://localhost:9090/api/bills/${userId}`);
    setBills(res.data);
  }

  const handleDownload = async (billTitle, billId) => {
        try {
            const response = await fetch(`http://localhost:9090/api/bills/${billId}/download`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${billTitle}_${billId}.pdf`); // Desired filename
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };

    const handleDelete = async (billId) => {
      if (!window.confirm("Are you sure you want to delete this bill ?"))
        return;
      try {
          const response = await axios.delete(`http://localhost:9090/api/bills/delete/${billId}`);
          console.log("Bill deleted");
          fetchBills(userId);
      } catch (error) {
          console.error('Error deleting bill:', error);
      }
  };

  return (
    <div>
      <h3>All Bills</h3>
      {bills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.title}</td>
                <td>{bill.category}</td>
                <td>₹{bill.amount}</td>
                <td>{bill.dueDate}</td>
                <td>
                <button
                  onClick = {() => handleDownload(bill.title, bill.id)}
                  className="btn btn-sm"
                  style={{ backgroundColor: "#2ca628", color: "white", border: "none" }}
                >
                  Download
                </button>
                {/* <button
                  onClick = {() => handleDelete(bill.id)}
                  className="btn btn-sm ms-2"
                  style={{ backgroundColor: "#d10000", color: "white", border: "none" }}
                >
                  Delete
                </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewBills;