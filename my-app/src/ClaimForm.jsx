import React, { useState } from 'react';
import './Form.css';
import ClaimImage from './ClaimImage.jpg';
import Swal from 'sweetalert2';

const categories = [
  { name: 'Telephone', maxAmount: 1000 },
  { name: 'Internet', maxAmount: 1000 },
  { name: 'Medical', maxAmount: 5000 },
  { name: 'Travel', maxAmount: 25000 }
];


const ExpenseClaimForm = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [receiptDate, setReceiptDate] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);


  const handleClear = () => {
    setCategory('');
    setDescription('');
    setReceiptDate('');
    setClaimAmount('');
    setIsSubmitted(false);
    setError('');
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedCategory = categories.find((item) => item.name === category);
    // Validate Form Inputs
    if (!category || !description || !receiptDate || !claimAmount) {
      setError("Please fill in all required fields.");
      return;
    } else if (!selectedCategory) {
      setError('Invalid category.');
    } else if (parseFloat(claimAmount) > selectedCategory.maxAmount) {
      setError('Claim amount exceeds the maximum allowed for this category.');
    } else if (
      isNaN(Date.parse(receiptDate)) ||
      new Date(receiptDate).getTime() > Date.now() ||
      (Date.now() - new Date(receiptDate).getTime()) / (24 * 60 * 60 * 1000) > 30
    ) {
      setError('Receipt date is invalid or exceeds the maximum allowed duration.');
    } else if (description.length > 200) {
      setError('Claim description exceeds the maximum character limit.');
    } else {
      console.log({ category, description, receiptDate, claimAmount });
      setIsSubmitted(true);
      setError('');
      event.target.reset(); // Reset the form
      setIsSubmitted(false); // Set isSubmitted back to false
      // Show a success message using Sweet Alert
      Swal.fire({
        icon: 'success',
        title: 'Form submitted successfully!',
        timer: 3000,
        showConfirmButton: false
      });
      handleClear();
    }
  };


  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) {
      dd = `0${dd}`;
    }

    if (mm < 10) {
      mm = `0${mm}`;
    }

    return `${yyyy}-${mm}-${dd}`;
  };

  const getMinDate = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
    const yyyy = thirtyDaysAgo.getFullYear();
    let mm = thirtyDaysAgo.getMonth() + 1;
    let dd = thirtyDaysAgo.getDate();

    if (dd < 10) {
      dd = `0${dd}`;
    }

    if (mm < 10) {
      mm = `0${mm}`;
    }

    return `${yyyy}-${mm}-${dd}`;
  };


  return (
    <div className="expense-claim-form-container" style={{ backgroundImage: `url(${ClaimImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div>
        <form onSubmit={handleSubmit} className="expense-claim-form">
          <h2 className="text-center" style={{ paddingBottom: "20px" }}>Expense Claim Form</h2>
          <div className="form-row">
            <label htmlFor="category">Category:</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select category</option>
              {categories.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="description">Claim Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              placeholder='(Max limit 200 char.)'
            />
          </div>
          <div className="form-row">
            <label htmlFor="receipt-date">Receipt Date:</label>
            <input type="date" placeholder="DD-MM-YYYY" id="receipt-date" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} min={getMinDate()} max={getCurrentDate()} />
          </div>
          <div className="form-row">
            <label htmlFor="claim-amount">Claim Amount:</label>
            <input
              placeholder='(Up to 2 decimals)'
              type="number"
              step="0.01"
              id="claim-amount"
              value={claimAmount}
              onChange={(e) => {
                const { value } = e.target;
                const regex = /^[0-9]*\.?[0-9]{0,2}$/; // Regular expression to allow numbers with up to 2 decimal places
                if (regex.test(value)) {
                  setClaimAmount(value);
                }
              }}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" style={{ margin: "auto auto auto 27%" }}>Submit</button>
          <button type="reset" onClick={handleClear} style={{ marginLeft: "20px" }}>Clear</button>

        </form>
      </div>
    </div>
  );
};

export default ExpenseClaimForm;
