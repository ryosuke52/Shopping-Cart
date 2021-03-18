import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js/pure';
import {PaymentEdit} from '../components/Payment'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51IMWb4AW9ffsh0IPxAjfueaZXdJlot8ZCJ47MilKmpMzr1U06ddrQhu00x1PaSOBYKCk8kxEPGLQeTYTe5DwZlU4004MzZJ6qU');

const CheckoutWrapper = () => {

    return (
       <Elements stripe={stripePromise}>
          <PaymentEdit />
       </Elements>
    );
};

export default CheckoutWrapper;