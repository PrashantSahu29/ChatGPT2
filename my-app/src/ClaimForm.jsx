
import React, { useState } from 'react';
import './Form.css';
import ClaimImage from './ClaimImage.jpg';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categories = [
  { name: 'Telephone', maxAmount: 1000 },
  { name: 'Internet', maxAmount: 1000 },
  { name: 'Medical', maxAmount: 5000 },
  { name: 'Travel', maxAmount: 25000 },
];

const ExpenseClaimForm = () => {
  // Declare state variables using the 'useState' hook
const [category, setCategory] = useState('');
const [description, setDescription] = useState('');
const [descriptionLength, setDescriptionLength] = useState(0); // Track the length of the description input
const [receiptDate, setReceiptDate] = useState('');
const [claimAmount, setClaimAmount] = useState('');
const [error, setError] = useState('');
const [isSubmitted, setIsSubmitted] = useState(false);


  const handleClear = () => {
    setCategory('');
    setDescription('');
    setDescriptionLength(0);
    setReceiptDate('');
    setClaimAmount('');
    setIsSubmitted(false);
    setError('');
  };

  // Define a function that handles form submission
const handleSubmit = (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  // Find the selected category from the list of categories
  const selectedCategory = categories.find((item) => item.name === category);

  // Validate Form Inputs
  if (!category || !description || !receiptDate || !claimAmount) {
    // Display an error message if any required fields are empty
    toast.error ('Please fill in all required fields.');
    return;
  } else if (!selectedCategory) {
    // Display an error message if the selected category is invalid
    toast.error('Invalid category.');
  } else if (parseFloat(claimAmount) > selectedCategory.maxAmount) {
    // Display an error message if the claim amount exceeds the maximum allowed for the selected category
    toast.error('Claim amount exceeds the maximum allowed for this category.');
  } else if (
    isNaN(Date.parse(receiptDate)) ||
    new Date(receiptDate).getTime() > Date.now() ||
    (Date.now() - new Date(receiptDate).getTime()) / (24 * 60 * 60 * 1000) > 30
  ) {
    // Display an error message if the receipt date is invalid or exceeds the maximum allowed duration (30 days)
    toast.error('Receipt date is invalid or exceeds the maximum allowed duration.');
  } else if (descriptionLength > 200) {
    // Display an error message if the claim description exceeds the maximum character limit (200 characters)
    toast.error('Claim description exceeds the maximum character limit.');
  } else {
    // If all input is valid, log the form data to the console, set isSubmitted to true to trigger a success message, reset the form, and clear any error messages
    console.log({ category, description, receiptDate, claimAmount });
    setIsSubmitted(true);
    setError('');
    event.target.reset(); // Reset the form
    setIsSubmitted(false); // Set isSubmitted back to false
    // Show a success message using Sweet Alert
    Swal.fire({
      icon: 'success',
      title: 'Form submitted successfully!',
    });
    handleClear();
  }
};


  // Function to get the current date in the format YYYY-MM-DD
const getCurrentDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // getMonth() returns 0-indexed month, so add 1 to get the correct month number
  let dd = today.getDate();

  // Add leading zero to single digit date or month
  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (mm < 10) {
    mm = `0${mm}`;
  }

  return `${yyyy}-${mm}-${dd}`;
};

// Function to get the minimum date allowed, which is 30 days ago from the current date
const getMinDate = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30)); // Set the date to 30 days ago
  const yyyy = thirtyDaysAgo.getFullYear();
  let mm = thirtyDaysAgo.getMonth() + 1; // getMonth() returns 0-indexed month, so add 1 to get the correct month number
  let dd = thirtyDaysAgo.getDate();

  // Add leading zero to single digit date or month
  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (mm < 10) {
    mm = `0${mm}`;
  }

  return `${yyyy}-${mm}-${dd}`;
};


  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    setDescriptionLength(event.target.value.length); // Update the description length whenever the input changes
  };

  return (
    <div className="expense-claim-form-container" style={{ backgroundImage: `url(${ClaimImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div>
        <form onSubmit={handleSubmit} className="expense-claim-form">
          <h2 className="text-center" style={{ paddingBottom: '20px' }}>
            Expense Claim Form
          </h2>
          <div className="form-row">
            <label htmlFor="category">Category:</label>
            {/* Dropdown to select the expense category */}
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select category</option>
              {/* Map through the categories to populate the dropdown options */}
              {categories.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="description">Claim Description:</label>
            {/* Textarea to input the description of the expense claim */}
            <textarea id="description" value={description} onChange={handleDescriptionChange} maxLength={200} placeholder="Eg. This is description" />
          </div>
          {/* Show the remaining character count */}
          <div className="form-row" style={{ marginLeft: '42%', color: descriptionLength > 200 ? 'red' : 'black' }}>
            Remaining characters: {200 - descriptionLength}
          </div>

          <div className="form-row">
            <label htmlFor="receipt-date">Receipt Date:</label>
            {/* Input field to select the date of the receipt */}
            <input type="date" placeholder="DD-MM-YYYY" id="receipt-date" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} min={getMinDate()} max={getCurrentDate()} />
          </div>

          <div className="form-row">
            <label htmlFor="claim-amount">Claim Amount:</label>
            {/* Input field to input the amount of the expense claim */}
            <input
              placeholder={`Up to 2 decimals, max: ${category && categories.find((item) => item.name === category).maxAmount}`}
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
          {/* Display any errors if present */}
          {error && <p className="error">{error}</p>}
          {/* Submit and Clear buttons */}
          <button type="submit" style={{ margin: 'auto auto auto 27%' }}>
            Submit
          </button>
          <button type="reset" onClick={handleClear} style={{ marginLeft: '20px' }}>
            Clear
          </button>
          {/* Toast notifications */}
          <ToastContainer position="top-right" autoClose={false} closeOnClick rtl={false} pauseOnFocusLoss pauseOnHover draggable theme="colored" />
        </form>
      </div>
    </div>
  );

};

export default ExpenseClaimForm;



