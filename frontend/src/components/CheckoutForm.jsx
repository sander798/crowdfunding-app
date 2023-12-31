import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
//import axios from "axios";
import "./CheckoutForm.css";
import { saveDonationData } from "../helpers/saveDonationData";

const CheckoutForm = ({ selectedProject }) => {
  // console.log(
  //   "reached checkout form component selectedproject,",
  //   selectedProject
  // );
  //  if (selectedProduct === null) history.push('/')
  const stripe = useStripe();
  const elements = useElements();

  let receiptUrl = null;
  let success = false;
  //const [receiptUrl, setReceiptUrl] = useState("");
  const [donationAmount, setDonationAmount] = useState(0);

  console.log("elements:", elements);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    const cardElement = elements.getElement(CardNumberElement);
    let token = null;

    await stripe
      .createToken(cardElement)
      .then((result) => {
        console.log("token created successfully,token api", result.token);
        token = result.token;
      })
      .catch((error) => {
        console.error("error occurred", error);
      });
    const payload = {
      amount: donationAmount * 100, //converted $ to  cents
      //currency: "usd",
      source: token.id,
      receipt_email: "mehwish219@outlook.com",
    };
    const response = await fetch(
      `http://localhost:3001/api/stripe/charge/${selectedProject.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );
    if (response.ok) {
      const order = await response.json();
      console.log("order response received from fetch", order);
      success = true;
      receiptUrl = order.charge.receipt_url;
      console.log("receiptUrl", receiptUrl);
      console.log("success", success);
      //
      //save donation payment info to db
      const donationData = {
        //userid
        donor_id: Cookies.get("userid"),
        ///projectid
        project_id: selectedProject.id,
        //amount
        funding_amount: order.charge.amount,
        //chargeid
        charge_id: order.charge.id,
        //date
        donation_date: new Date(),
      };
      const result = saveDonationData(donationData);
    }

    //setReceiptUrl(order.receipt_url);
  };

  if (success) {
    //not working yet (in progress)
    return (
      <div className="success">
        <h2>Payment Successful!</h2>
        <a href={receiptUrl}>View Receipt</a>
        <Link to="/">Home</Link>
      </div>
    );
  }
  return (
    <div className="checkout-form">
      <form onSubmit={handleSubmit}>
        <label>Enter Amount:</label>
        <input
          name="donationAmount"
          value={donationAmount}
          onChange={(e) => {
            setDonationAmount(e.target.value);
          }}
        />
        <label>
          Card details
          <CardNumberElement />
        </label>
        <label>
          Expiration date
          <CardExpiryElement />
        </label>
        <label>
          CVC
          <CardCvcElement />
        </label>
        <button type="submit" className="order-button">
          Pay
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;