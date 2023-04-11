import React, { useState } from 'react';
import './Form.css';
import ClaimImage from './ClaimImage.jpg';

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedCategory = categories.find((item) => item.name === category);
    
    // Validate Form Inputs
    if (!category || !description || !receiptDate || !claimAmount) {
      setError("Please fill in all required fields.");
      return;
    }
    else if (!selectedCategory) {
      setError('Invalid category.');
    }
    else if (parseFloat(claimAmount) > selectedCategory.maxAmount) {
      setError('Claim amount exceeds the maximum allowed for this category.');
    }
    else if (
      isNaN(Date.parse(receiptDate)) ||
      new Date(receiptDate).getTime() > Date.now() ||
      (Date.now() - new Date(receiptDate).getTime()) / (24 * 60 * 60 * 1000) > 30
    ) {
      setError('Receipt date is invalid or exceeds the maximum allowed duration.');
    }
    else if (description.length > 200) {
      setError('Claim description exceeds the maximum character limit.');
    }
    else {
      console.log({ category, description, receiptDate, claimAmount });
      setIsSubmitted(true);
      setError('');
      event.target.reset(); // Reset the form
      // window.alert("Form submitted successfully!"); // Show the alert popup
    }
  };

  return (
    <>
    <div className="expense-claim-form-container" style={{ backgroundImage: `url(${ClaimImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div>
      <h1 style={{marginLeft:"20px"}}>Expense Claim Form</h1>
      <form onSubmit={handleSubmit} className="expense-claim-form">
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
          />
        </div>
        <div className="form-row">
          <label htmlFor="receipt-date">Receipt Date:</label>
          <input type="date" id="receipt-date" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} />
        </div>
        <div className="form-row">
          <label htmlFor="claim-amount">Claim Amount:</label>
          <input type="number" step="0.01" id="claim-amount" value={claimAmount} onChange={(e) => setClaimAmount(e.target.value)} />
        </div>
        {error && <p className="error">{error}</p>}
        {isSubmitted && <p className="success">Form submitted successfully!</p>}
        <button type="submit" style={{margin:"auto", marginLeft:"38%"}}>Submit</button>
      </form>
      </div>
    </div>
    </>
  );
};

export default ExpenseClaimForm;
