
import React, { useEffect, useState } from 'react'
import { Toast } from "react-bootstrap";
import axios from 'axios';
//import { ccavencrypt, ccavAccessCode, ccavWorkingKey, encryptWithMD5AES, actionUrl } from '../../global'
import { useParams, useNavigate } from "react-router-dom";

//import { ccavMerchantId, ccavRedirectURL, ccavCancelURL} from '../../global'
import { baseUrl } from "../../apiConfig";
// import './CCAvenue.css'

const PaymentInfo = ({payAmount, formValues, event, merchandise, existingItems }) => {
      console.log(formValues, "formValues in payment info")
const existingAmount = existingItems?.reduce((total, item, index) => {
  const isVIP = formValues?.categoryName === "LykYou3000 (VIP)" && index === 0;
  return total + (isVIP ? 0 : (item.price || 0));
}, 0);
console.log(formValues?.merchandiseId, "formValues?.merchandiseId===")
   const findMerchandise = merchandise && merchandise?.find(item => item.id === formValues?.merchandiseId)
   console.log(findMerchandise, "findMerchandise===")
const totalMerchandiseAmount = formValues?.merchandiseIds
  ? formValues.merchandiseIds.reduce((total, item, index) => {
      const isVIP = formValues?.categoryName === "LykYou3000 (VIP)" && index === 0;
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return total + (isVIP ? 0 : itemTotal);
    }, 0)
  : 0;
  const multipleMerchandiseAmount = totalMerchandiseAmount - existingAmount;
      const hasDiscountMerchandise = formValues?.merchandiseIds?.some(item => [6, 7, 9, 10].includes(item.id));
  const selectedIds = formValues?.merchandiseIds?.map(item => item.id) || [];
const existingIds = existingItems?.map(item => item.id) || [];

const newlyAddedDiscountItems = selectedIds.filter(id => [6, 7, 9, 10].includes(id) && !existingIds.includes(id));

const hasDiscountMerchandiseForExisting = newlyAddedDiscountItems.length > 0;
  const [accessCode, setAccessCode] = useState()
  const [encRequest, setEncRequest] = useState()
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
const findCategory = event?.category?.find(item=>item?.name === formValues?.categoryName);
const groupAmount = formValues?.registeredUsers?.reduce((acc, user) => {
  const category = event?.category?.find(item => item?.name === user?.categoryName);
  return acc + (category?.amount ? Number(category.amount) : 0);
}, 0);
let relayCategory;
if(formValues?.registeredUsers) {
relayCategory = event?.category?.find(item=> item?.name === formValues?.registeredUsers[0]?.categoryName);
}
const [isExpanded, setIsExpanded] = useState(false);
//const findCoupon = coupons?.find(item => item?.couponCode?.toLowerCase() === formValues?.couponCode?.toLowerCase());
  const navigate = useNavigate();
  let params = useParams();  
  const currday = new Date()
  const orderId = currday.getTime().toString()
  window.localStorage.setItem('orderId', orderId)
  //const orderAmount = 1
  //const orderKey = 'merchant_id=' + ccavMerchantId + '&order_id=' + orderId + '&currency=INR&amount=' + payAmount + '&redirect_url=' + ccavRedirectURL + '&cancel_url=' + ccavCancelURL + '&language=EN'
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  // Below code to submit and show ccavenue billing page
  useEffect (() => {

  },[])

  

  const handleFormSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.target);    
    // Perform any necessary processing here
    // Example: Redirect to the action URL
    // window.location.href = actionUrl;
    setFormSubmitted(true);
  };

  const options = {
    'key': formValues.key_id,
    'amount': formValues.amount,
    'order_id': formValues.paymentOrderId,
    'name': formValues.eventName,
    'description':formValues.category,
    'thumbnail':formValues.thumbnail,
    'prefill': {
      "name": `${formValues.firstName} ${formValues.lastName}`, //your customer's name
      "email": `${formValues.email}`, 
      "contact": `${formValues.mobileNumber}`,
    },
    'notes':{
      'address': `${formValues.address}, ${formValues.state}, ${formValues.country}, ${formValues.pincode}`,      
    },
    'handler': function(response){      
      setShowToast(true);
      setToastVariant('success');
      setToastMessage('Payment successful...');
      window.location.href=`https://www.novarace.in/pages/${event?.slug}/success/${(event?.isGroupRegistrations || relayCategory?.isRelay === "YES") ? formValues?.registeredUsers[0]?.id : formValues?.id}`      
    }
  }
  
  const launchPayment = event => {
    // eslint-disable-next-line no-undef
    var rzp1 = new Razorpay(options);
    rzp1.open();
    rzp1.on('payment.failed', function (response){      
      setToastVariant('danger');
      setToastMessage(`${response.error.description}`);
      setToastMessage(`${response.error.reason}`);
      setShowToast(true);
  });
  }
  const [isSentNotification, setIsSentNotification] = useState(false);
  const sendNotifications = async () => {
        if (isSentNotification) return;
        setIsSentNotification(true);
    try {
      const response = await axios.post(
        `${baseUrl}users/sendnotifications`,
        null,
        {
          params: {
            runnerId: (event?.isGroupRegistrations || relayCategory?.isRelay === "YES") ? formValues?.registeredUsers[0]?.id : formValues?.id,
            eventId: event?.id,
          },
        }
      );
  
      if (response.status === 200) {
      window.location.href=`https://www.novarace.in/pages/${event?.slug}/success/${(event?.isGroupRegistrations || relayCategory?.isRelay === "YES") ? formValues?.registeredUsers[0]?.id : formValues?.id}`
       
      console.log("Notifications sent successfully:", response.data);
      } else {
        console.warn("Failed to send notifications:", response.data);
      }
    } catch (error) {
      console.error(
        "Error sending notifications:",
        error.response?.data?.error || error.message
      );
      setIsSentNotification(false);
    }
  };
  
   const submitPayU = () => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = formValues.actionUrl;
  form.style.display = 'none';

  const fields = {
    key: formValues.key_id,
    txnid: formValues.paymentOrderId,
    amount: formValues.amount,
    productinfo: formValues.eventName,
 firstname: formValues?.registeredUsers ? formValues?.registeredUsers[0]?.firstName : formValues.firstName,
  email: formValues?.registeredUsers ? formValues?.registeredUsers[0]?.email : formValues.email,
  phone: formValues?.registeredUsers ? formValues?.registeredUsers[0]?.mobileNumber : formValues.mobileNumber,
    surl: formValues.surl,
    furl: formValues.furl,
    hash: formValues.hash
  };

  for (const name in fields) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = fields[name];
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
};


    return (
      <>
      <style>
        {
          `.table {
          white-space:nowrap;
          }
          `
        }
      </style>
      <div className='container text-center my-3'>
      <div className="row justify-content-center">
      <h3>Order Preview</h3>
      {/* <h5 className='text-success mt-20'>You are almost done. Please complete the payment to complete registration process...</h5> */}
      <div className="col-sm-12 col-md-6 col-lg-5 col-xl-4 table-responsive mt-3 shadow-lg">
      <table className="table table-striped text-left mb-0">
        <tr>
          <td className='p-1'>{event?.isGroupRegistrations ? "Total ticket price" : relayCategory?.isRelay === "YES" ? "Ticket Price" : "Ticket Price"}:
          {(event?.isGroupRegistrations || relayCategory?.isRelay === "YES") && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 btn btn-sm btn-link"
            >
              {isExpanded ? <i
              className="bi bi-caret-up-fill" /> : <i className="bi-caret-down-fill" />}
            </button>
          )}
          </td>
          <td className='p-1 text-right'>₹ {event?.isGroupRegistrations ? groupAmount : relayCategory?.isRelay === "YES" ? relayCategory?.amount : (formValues?.eventOrderId && !formValues?.couponCode) ? 0 : event?.slug === "tumakuru-marathon-2026-2nd-edition" ? findCategory?.displayAmount : findCategory?.amount}
          </td>
        </tr>
        {isExpanded && (event?.isGroupRegistrations || relayCategory?.isRelay === "YES") && (
        <tr>
          <td colSpan="2">
            <table className="table table-sm mb-0">
              <thead>
                <tr>
                  <th className='p-1 fw-bold' style={{whiteSpace:"nowrap"}}>Participant</th>
                  <th className='p-1 fw-bold' style={{whiteSpace:"nowrap"}}>Category</th>
                  <th className='p-1 fw-bold' style={{whiteSpace:"nowrap"}}>Amount</th>
                  {formValues?.couponCode && (
                    <>
  <th className='p-1 fw-bold' style={{whiteSpace:"nowrap"}}>Coupon</th>
  </>
  
)}
                </tr>
              </thead>
              <tbody>
                {formValues?.registeredUsers?.map((user, index) => {
                  const category = event?.category?.find(
                    (item) => item?.name === user?.categoryName
                  );
                  // const coupon = coupons?.find(item => item?.couponCode === user.couponCode)
                  return (
                    <tr key={index}>
                      <td className='p-1' style={{whiteSpace:"nowrap"}}>Participant {index + 1}</td>
                      <td className='p-1' style={{whiteSpace:"nowrap"}}>{user?.categoryName}</td>
                      <td className='p-1' style={{whiteSpace:"nowrap"}}>₹ {category?.amount || "0"}</td>
                      {formValues?.couponCode && (
                        <>
              <td className='p-1' style={{whiteSpace:"nowrap"}}>{formValues?.couponCode || ""}</td>
             </>
            )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </td>
        </tr>
      )}
        {/* {findMerchandise && formValues?.tShirtSize &&
        <>
          <tr>
          <th className='p-1'>T-Shirt Size:</th>
          <td className='p-1 text-right'><b>{formValues?.tShirtSize}</b></td>
        </tr>
        </>
        } */}
        {hasDiscountMerchandise && !formValues?.eventOrderId &&
         <>
          <tr>
          <th className='p-1'>Discount on Add ons (20%):</th>
          <td className='p-1 text-right'>₹ {(0.2 * (multipleMerchandiseAmount + parseInt(findCategory?.amount)))}</td>
        </tr>
        </>
        }
         {hasDiscountMerchandiseForExisting && formValues?.eventOrderId &&
         <>
          <tr>
          <th className='p-1'>Discount on Add ons (20%):</th>
          <td className='p-1 text-right'>₹ {(0.2 * (multipleMerchandiseAmount))}</td>
        </tr>
        </>
        }
        {formValues?.membershipId && 
        <>
          <tr>
          <th className='p-1'>Membership Id:</th>
          <td className='p-1 text-right'>{formValues?.membershipId}</td>
        </tr>
        </>
        }
           {formValues?.registeredUsers && formValues?.registeredUsers[0]?.teamName &&
        <>
          <tr>
          <th className='p-1'>Team Name:</th>
          <td className='p-1 text-right'>{formValues?.registeredUsers[0]?.teamName}</td>
        </tr>
        <tr>
          <th className='p-1'>Team Contact Person Number:</th>
          <td className='p-1 text-right'>{formValues?.registeredUsers[0]?.teamContactPersonNumber}</td>
        </tr>
        </>
        }
        {formValues?.couponCode &&
        <>
          <tr>
          <th className='p-1'>Coupon Code Applied:</th>
          <td className='p-1 text-right'>{formValues?.couponCode}</td>
        </tr>
          <tr>
          <th className='p-1'>Discount:</th>
          {/* <td className='p-1 text-right'><b>₹ {findCoupon?.discountAmount ? `${findCoupon?.discountAmount}` : (((event?.isGroupRegistrations ? groupAmount : relayCategory ? relayCategory?.amount : findCategory?.amount) * findCoupon?.discountPercentage) / 100).toFixed(2)}</b></td> */}
        <td className='p-1 text-right'>
₹ {
  (
    Math.round(
      (
        Number(
          (event?.isGroupRegistrations ? groupAmount
            : relayCategory?.isRelay === "YES"
              ? relayCategory?.amount
              : 
              findMerchandise ? 
              (parseFloat(findMerchandise?.price) || 0) + (parseFloat(findCategory?.amount || 0))
              : formValues?.merchandiseIds && formValues?.merchandiseIds?.length > 0 ?
              (parseFloat(multipleMerchandiseAmount) || 0) + (parseFloat(findCategory?.amount || 0))
              : findCategory?.amount
          ) || 0
        ) +
        Number(formValues?.applicationFee || 0) +
        Number(formValues?.gstOnPlatformCharges || 0) -
        Number(formValues?.amount || 0) - 
        Number((formValues?.greenWarrior === "Opting for event organiser's transportation" ||
    formValues?.greenWarrior === "Coming to the event by an EV (electric car)" ||
     formValues?.greenWarrior === "Carpooling: 4+ occupants" ||
      formValues?.greenWarrior === "Bringing your own bottle") ? (10/100) * findCategory?.amount : 0) +
       Number(event?.isGstOnRegFee === true ? formValues?.gstOnRegistrationFee : 0)
      ) * 100
    ) / 100
  ).toFixed(2)
}
        </td>
        </tr>
        </>
        }
            {findMerchandise && findMerchandise.price !== 0 && 
        <>
          <tr>
          <td className='p-1'>Addon Price:</td>
          <td className='p-1 text-right'>₹ {findMerchandise?.price}</td>
        </tr>
        </>
        }
        {formValues?.merchandiseIds && formValues?.merchandiseIds?.length !== 0 &&
         <>
          <tr>
          <th className='p-1'>Addon Price:</th>
          <td className='p-1 text-right'>₹ {multipleMerchandiseAmount}</td>
        </tr>
        </>
        }
        {(formValues?.greenWarrior === "Opting for event organiser's transportation" ||
    formValues?.greenWarrior === "Coming to the event by an EV (electric car)" ||
     formValues?.greenWarrior === "Carpooling: 4+ occupants" ||
      formValues?.greenWarrior === "Bringing your own bottle") &&
        <>
          
          <tr>
          <th className='p-1'>Green Warrior Discount:</th>
          {/* <td className='p-1 text-right'><b>₹ {findCoupon?.discountAmount ? `${findCoupon?.discountAmount}` : (((event?.isGroupRegistrations ? groupAmount : relayCategory ? relayCategory?.amount : findCategory?.amount) * findCoupon?.discountPercentage) / 100).toFixed(2)}</b></td> */}
        <td className='p-1 text-right'>
₹ {((10/100) * findCategory?.amount).toFixed(2)}
        </td>
        </tr>
        </>
        }
        {(event?.slug === "nandi-hill-monsoon-run" || event?.slug === "lykn-unleashed-asia-tour-in-delhi" || event?.slug === "lykn-unleashed-asia-tour-in-bengaluru") &&
        <>
          <tr>
          <td className='p-1'>GST on Registration Fee (18%):</td>
        <td className='p-1 text-right'>
₹ {(formValues?.gstOnRegistrationFee).toFixed(2)}
        </td>
        </tr>
        </>
        }
        {event?.isGstOnRegFee === true &&
        <>
          <tr>
          <td className='p-1'>GST on Registration Fee (18%):</td>
        <td className='p-1 text-right'>
₹ {(formValues?.gstOnRegistrationFee)?.toFixed(2)}
        </td>
        </tr>
        </>
        }
         {(formValues?.applicationFee > 0) && event?.slug !== "jatre2026" && event?.slug !== "lykn-unleashed-asia-tour-in-bengaluru" &&
         <>
        <tr>
          <td className='p-1'>Platform Charges:</td>
          <td className='p-1 text-right'>₹ {(formValues?.applicationFee).toFixed(2)}</td>
        </tr>
        <tr>
          <td className='p-1'>GST On Platform Charges:</td>
          <td className='p-1 text-right'>₹ {(formValues?.applicationFee * 18 / 100).toFixed(2)}
  </td>
        </tr>
        </>
}
  {(formValues?.applicationFee > 0) && (event?.slug === "jatre2026" || event?.slug === "lykn-unleashed-asia-tour-in-bengaluru") &&
         <>
        <tr>
          <td className='p-1'>Platform Charges (Incl. GST):</td>
          <td className='p-1 text-right'> ₹ {((formValues?.applicationFee || 0) + (formValues?.applicationFee * 18 / 100 || 0)).toFixed(2)}</td>
        </tr>
        </>
}
{!formValues?.actionUrl &&
<>
{event?.slug !== "jatre2026" &&
<>
<tr>
          <td className='p-1'>Payment Gateway Charges (2%):</td>
          <td className='p-1 text-right'>₹ {formValues?.platformFee}</td>
        </tr>
        <tr>
          <td className='p-1'>GST On Payment Gateway Charges:</td>
          <td className='p-1 text-right'>₹ {formValues?.gst}</td>
        </tr>
        </>
}
        <tr style={{ borderTop: "1px solid #000" }}>
          <td className='p-1 fw-bold'>Estimated Total Payable*:</td>
          <td className='p-1 text-right fw-bold text-success'>₹ {formValues?.payableAmount}</td>
        </tr>
        </>
}
{formValues?.actionUrl &&
        <tr style={{ borderTop: "1px solid #000" }}>
          <td className='p-1 fw-bold'>Total Amount:</td>
          <td className='p-1 text-right fw-bold text-success'>₹ {formValues?.amount}</td>
        </tr>
}
        {/* <tr>
          <th >Amount:</th>
          <td ><b>{formValues.amount - formValues.applicationFee}</b></td>
        </tr>
        <tr>
          <th>Charges: </th>
          <td><b> {(formValues.applicationFee + formValues.platformFee + formValues.gst).toFixed(2)} </b></td>
        </tr>        
        <tr>
          <th>Total Amount:</th>
          <td><b>{formValues.payableAmount}</b></td>
        </tr> */}
        <tr>
        <td colSpan="2" style={{ textAlign: "center" }}>
      <button className='btn btn-lg btn-success' onClick={() => {
    if (formValues.payableAmount === 0) {
      sendNotifications();
    } else {
      if(event?.paymentMethod === "payu") {
        submitPayU();
      }
      else {
      launchPayment();
      }

    }
  }}>{(formValues.payableAmount === 0 || formValues.payableAmount === null)  
    ? "Complete Registration" 
    : "Proceed to Pay"}</button>
          {/* 
          <form method="POST" action="https://api.razorpay.com/v1/checkout/embedded">
            <input type="hidden" name="key_id" value={formValues.key_id}/>
            <input type="hidden" name="amount" value={formValues.amount}/>
            <input type="hidden" name="order_id" value={formValues.paymentOrderId}/>
            <input type="hidden" name="name" value={formValues.eventName}/>
            <input type="hidden" name="description" value={formValues.category}/>
            <input type="hidden" name="image" value={formValues.thumbnail}/>
            <input type="hidden" name="prefill[name]" value={`${formValues.firstName} ${formValues.lastName}`}/>
            <input type="hidden" name="prefill[contact]" value={`${formValues.mobileNumber}`}/>
            <input type="hidden" name="prefill[email]" value={`${formValues.email}`}/>
            <input type="hidden" name="notes[shipping address]" value={`${formValues.address}, ${formValues.state}, ${formValues.country}, ${formValues.pincode}`}/>
            <input type="hidden" name="callback_url" value={`https://www.novarace.in/pages/success/${formValues.id}`}/>
            <input type="hidden" name="cancel_url" value={`https://www.novarace.in/pages/cancel/${formValues.id}`}/>
    <button className='btn btn-md btn-success'>Pay</button>  
          </form>
    */}
        </td>
        </tr>
      </table>
      {!formValues?.actionUrl &&
      <div className='mb-2'>* <span className='text-danger text-14'>Please note: This is a preliminary total. Your payment gateway may calculate processing fees slightly differently at checkout. The exact amount will be displayed before you confirm payment.</span>
        </div>
}
      {/* <i><b className='text-info'>Charges include Application Fee, Payment Gateway charges and Applicable GST</b></i> */}
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={5000}
          autohide
          className={`bg-${toastVariant} top-0 end-0 p-3 custom-toast`} >
          <Toast.Header closeButton={true} className="d-flex justify-content-between align-items-center">
            <strong className="mr-auto">Registration</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </div>
      </div>
    </div>
    </>  
    )
  }


// export default CCAvenue


export default PaymentInfo;
