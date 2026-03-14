import React, { useState, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import './StripePayment.css';
import SuccessModal from '../Successful Payment/SuccessModal';

const stripePromise = loadStripe('pk_test_51S12fR2UZo2ddZ4PCxpxxyGR9bYN4C2fqOKCEwrVZHSSgpvOYEKnXmzPSD8olaIFslI61wYoiRw4byX6pQusUqUG00yliksheC');

const CheckoutForm = ({ clientSecret, orderId, amount, onClose, setIsOrderCompleted }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lockedAmount] = useState(amount); // Lock the amount when the form mounts
  const { url, setcartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      
      // Verify payment on backend
      try {
        const response = await axios.post(`${url}/api/order/verify`, { success: true, orderId });
        if (response.data.success) {
          setIsOrderCompleted(true);
          setcartItems({});
          setShowSuccessModal(true);
        } else {
          setError("Order verification failed.");
        }
      } catch (err) {
        console.error(err);
        setError("Error communicating with server.");
      }
    }
  };

  if (showSuccessModal) {
    return (
      <SuccessModal 
        show={true} 
        amount={lockedAmount} 
        onClose={() => {
          setShowSuccessModal(false);
          onClose(); // Close the StripePayment modal
          navigate("/"); // Redirect to home
        }} 
      />
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Complete Payment</h2>
      <p>Total Amount: <b>${lockedAmount}</b></p>
      
      <div className="stripe-element-container">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
          },
        }} />
      </div>

      {error && <div className="payment-error">{error}</div>}

      <button disabled={processing || !stripe} type="submit">
        {processing ? "Processing..." : `Pay $${lockedAmount}`}
      </button>
    </form>
  );
};

const StripePayment = ({ show, onClose, clientSecret, orderId, amount, setIsOrderCompleted }) => {
  if (!show) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal-content">
        <button className="close-modal-btn" onClick={onClose}>&times;</button>
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            clientSecret={clientSecret} 
            orderId={orderId} 
            amount={amount} 
            onClose={onClose}
            setIsOrderCompleted={setIsOrderCompleted}
          />
        </Elements>
      </div>
    </div>
  );
};

export default StripePayment;
