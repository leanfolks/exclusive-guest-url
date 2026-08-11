import './CustomerInfo.css';
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import DatePicker from "react-multi-date-picker";
import { Modal, } from 'react-bootstrap';
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import axios from 'axios';
import { baseUrl } from '../../apiConfig';

const BibNumberDetails = ({registrationUrl, randomString, verificationData, isEmailVerificationEnabled, isSmsVerificationEnabled, formik, eventCategory, categoryNames, categoryMinimumAge, customSlug, isMatched, matchedAgeBracket, guestBibNumber, eventId,  onBibLookup }) => {  


  const [isHovered, setIsHovered] = useState(false);
const calculateAge = useMemo(() => {
    return (dateOfBirth) => {
      const birthDate = new Date(dateOfBirth);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();

      if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
          currentDate.getDate() < birthDate.getDate())
      ) {
        return age - 1;
      }
  
      return age;
    };
  }, []);



  const [age, setAge] = useState(calculateAge(formik.values.dateOfBirth));
console.log(age)
  const handleDateChange = useCallback(
    (date) => {
      if (!date) {
        formik.setFieldTouched("dateOfBirth", true, true);
        formik.setFieldValue("dateOfBirth", null, true);
        setAge("");
        return;
      }
      formik.setFieldTouched('dateOfBirth', true);
      // formik.setFieldValue("dateOfBirth", date instanceof Date ? date : new Date(date));
      const adjustedDate = new Date(date);
      adjustedDate.setMinutes(adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset());
      const utcDate = new Date(Date.UTC(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate()));
      formik.setFieldValue("dateOfBirth", utcDate);
      const newAge = calculateAge(date);      
      setAge(newAge);
    },
    [calculateAge, formik]
  );

console.log(verificationData, "verifivcationData")

useEffect(() => {
  if (isEmailVerificationEnabled && verificationData?.email && formik.values.email !== verificationData.email) {
    formik.setFieldValue('email', verificationData.email);
  }

  if (isSmsVerificationEnabled && verificationData?.phoneNumber && formik.values.mobileNumber !== verificationData.phoneNumber) {
    formik.setFieldValue('mobileNumber', verificationData?.phoneNumber);
  }

  // Set fields as touched only if not already touched
  ['mobileNumber', 'contactNumber', 'dateOfBirth', 'gender'].forEach((field) => {
    if (formik.values[field] !== '' && !formik.touched[field]) {
      formik.setFieldTouched(field, true);
    }
  });

  // Delay form validation to avoid triggering on every render
  const timer = setTimeout(() => {
    formik.validateForm();
  }, 200);

  // Cleanup to clear the timer if the effect reruns
  return () => clearTimeout(timer);
}, [
  isEmailVerificationEnabled,
  isSmsVerificationEnabled,
  verificationData,
  formik.values.email,
  formik.values.mobileNumber,
  formik.values.contactNumber,
  formik.values.dateOfBirth,
  formik.values.gender,
  formik
]);


const [showOthersField, setShowOthersField] = useState(false);
console.log(showOthersField)
// const [showPopup, setShowPopup] = useState(false);
const [hoverCategory, setHoveredCategory] = useState(null)
  
const showDynamicDropdown =
  eventCategory?.tShirtSizeOptions &&
  (
    (eventCategory?.tShirtSizeOptions?.adults?.length > 0) ||
    (eventCategory?.tShirtSizeOptions?.kids?.length > 0)
  );

  const expiry = new Date(registrationUrl.expiresAt);
  expiry.setHours(23, 59, 59, 999); 
console.log(expiry, "expiry")
const isExpired = expiry && expiry <= new Date();
const isDisabled = !registrationUrl?.isEnabled;
const isClosed = isDisabled || isExpired;
    
  return (
    <>
    <style>
      {
        `
        .datepicker-no-outline:focus {
        outline: none;
      }
        `
      }
    </style>
    <div className="container p-3">
      <form
        id="reg"
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
          return false;
        }}
      >
  {isClosed && (
            <div className="text-center text-danger bg-light p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2em"
                height="2em"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <path d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M12 1.67c.955 0 1.845.467 2.39 1.247l.105.16l8.114 13.548a2.914 2.914 0 0 1-2.307 4.363l-.195.008H3.882a2.914 2.914 0 0 1-2.582-4.2l.099-.185l8.11-13.538A2.914 2.914 0 0 1 12 1.67M12.01 15l-.127.007a1 1 0 0 0 0 1.986L12 17l.127-.007a1 1 0 0 0 0-1.986zM12 8a1 1 0 0 0-.993.883L11 9v4l.007.117a1 1 0 0 0 1.986 0L13 13V9l-.007-.117A1 1 0 0 0 12 8"
                  ></path>
                </g>
              </svg>
<h5>
          This link is deactivated or expired
              </h5>
              </div>
)}
          <div className={`${isMatched ? "bg-success rounded fs-4" : "bg-danger rounded fs-4" } text-center text-white mb-3 mx-auto`}>{matchedAgeBracket}</div>
        <div className="row x-gap-40 y-gap-20 justify-content-center">
 

<div className="col-md-6">
  <div className="border p-4">
<p className="fw-bold">Enter your Bib Number below to continue</p>
          <div className={`form-input form-group row align-items-center m-2 ${formik.touched.guestBibNumber && formik.errors.guestBibNumber ? "errorStyle" : ''}`}>
          <label className="text-16 fw-bold col-sm-4">Bib Number <span className='text-danger'>*</span></label>
              <div className='col-sm-8 mt-3'>
              <input
                type="guestBibNumber"
                id="guestBibNumber"
                className='form-control'
                name="guestBibNumber"
                onChange={(e) => formik.handleChange(e)}
                onBlur={formik.handleBlur}
                value={formik.values.guestBibNumber || ""}
                style={{
                  border: formik.touched.guestBibNumber && formik.errors.guestBibNumber && "1px solid #dc2626",
                  backgroundColor: formik.touched.guestBibNumber && formik.errors.guestBibNumber && "#ffffff"
                 }}
              />

            {formik.touched.guestBibNumber && formik.errors.guestBibNumber && (
              <div className="text-danger">{formik.errors.guestBibNumber}</div>
            )}
            </div>
          </div>

</div>


  </div>


</div>



      </form>
    </div>
  </>
  );
};

export default BibNumberDetails;
