import React, { useEffect, useState, useCallback } from 'react';
//import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import './modal.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { baseUrl } from "../../apiConfig";

// const metadata = {
//   title: 'Verify Runner || Novarace',
//   description: 'Novarace',
// };

const VerifyRunner = ({
  closeModal,
  onVerify,
  isEmailVerificationEnabled,
  isSmsVerificationEnabled,
}) => {
  //const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  //const [emailOtp, setEmailOtp] = useState('');
  const [smsOtp, setSmsOtp] = useState('');
  const [isEmailButtonDisabled, setIsEmailButtonDisabled] = useState(false);
  const [isSmsButtonDisabled, setIsSmsButtonDisabled] = useState(false);
  //const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showSmsOtp, setShowSmsOtp] = useState(false);
  //const [emailInputDisabled, setEmailInputDisabled] = useState(false);
  const [phoneNumberInputDisabled, setPhoneNumberInputDisabled] =
    useState(false);

  //const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(false);
  //const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isSmsLoading, setIsSmsLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  console.log(phoneNumber, isEmailButtonDisabled, isSmsButtonDisabled)
  const isEmailVerified = false;

  const formik = useFormik({
    initialValues: {
      email: '',
      phoneNumber: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid Email format')
        .required('Email is required')
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          'Invalid Email format'
        ),
      phoneNumber: Yup.string()
        .matches(
          /^[0-9]{10}$/,
          'Mobile Number should not start with 0 or +91 and should be 10 digits'
        )
        .required('PhoneNumber is required '),
    }),
    onsubmit: (values) => {
      console.log('Form data', values);
    },
  });

  // const handleEmailChange = (e) => {
  //   setEmail(e.target.value);
  //   formik.handleChange(e);
  // };
  useEffect(() => {
    let interval = null;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsResendDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleFocus = (inputId) => {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    formik.setFieldValue('phoneNumber', value, true);
    setPhoneNumber(value);
  };

  // const handleEmailOtpChange = (e) => {
  //   const value = e.target.value.replace(/\D/g, '');
  //   setEmailOtp(value);
  // };

  // const handleSmsOtpChange = (e) => {
  //   const value = e.target.value.replace(/\D/g, '');
  //   setSmsOtp(value);
  // };

  // const handleSendEmailOtp = async () => {
  //   setIsEmailLoading(true);
  //   try {
  //     setIsEmailButtonDisabled(true);
  //     const response = await axios.post(`${baseUrl}users/register/emailOtp`, {
  //       email: formik.values.email,
  //     });
  //     if (response.status === 200) {
  //       setShowEmailOtp(true);
  //       setToastMessage('Email OTP sent successfully!');
  //       setShowToast(true);
  //     } else {
  //       console.error('Failed to send OTP:', response.statusText);
  //       setToastMessage('Failed to send Email OTP');
  //       setShowToast(true);
  //       setIsEmailButtonDisabled(false);
  //     }
  //   } catch (error) {
  //     console.error('Error sending OTP:', error);
  //     setToastMessage('please enter valid Email id');
  //     setShowToast(true);
  //     setIsEmailButtonDisabled(false);
  //   } finally {
  //     setIsEmailLoading(false);
  //   }
  // };

  const handleSendSmsOtp = async () => {
    setIsSmsLoading(true);
    try {
      setIsSmsButtonDisabled(true);
      const response = await axios.post(`${baseUrl}users/register/smsOtp`, {
        phoneNumber: formik.values.phoneNumber,
      });
      if (response.status === 200) {
        setShowSmsOtp(true);
        setToastMessage('SMS OTP sent successfully!');
        setShowToast(true);
        setTimer(60);
        setIsResendDisabled(true);
      } else {
        console.error('Failed to send OTP:', response.statusText);
        setToastMessage('Failed to send SMS OTP');
        setShowToast(true);
        setIsEmailButtonDisabled(false);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setToastMessage('please enter valid phoneNumber');
      setShowToast(true);
      setIsEmailButtonDisabled(false);
    } finally {
      setIsSmsLoading(false);
    }
  };

  // const handleVerifyEmailOtp = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const response = await axios.post(
  //       `${baseUrl}users/register/verifyEmailOtp`,
  //       { email: formik.values.email, emailOtp }
  //     );

  //     if (response.status === 200) {
  //       setShowEmailOtp(false);
  //       setToastMessage('Email verified successfully!');
  //       setShowToast(true);
  //       setEmailInputDisabled(true);
  //       setIsEmailButtonDisabled(true);
  //       setIsEmailVerified(true);
  //     } else {
  //       console.error('check the email otp:', response.statusText);
  //       setToastMessage('check the email otp');
  //       setShowToast(true);
  //     }
  //   } catch (error) {
  //     console.error('Wrong OTP:', error);
  //     setToastMessage('Wrong OTP');
  //     setShowToast(true);
  //   }
  // };

  const handleVerifySmsOtp = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}users/register/verifySmsOtp`,
        { phoneNumber: formik.values.phoneNumber, smsOtp }
      );

      if (response.status === 200) {
        setShowSmsOtp(false);
        setToastMessage('PhoneNumber verified successfully!');
        setShowToast(true);
        setPhoneNumberInputDisabled(true);
        setIsSmsButtonDisabled(true);
        setIsPhoneNumberVerified(true);
      } else {
        console.error('check the sms otp:', response.statusText);
        setToastMessage('check the sms otp');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Wrong OTP:', error);
      setToastMessage('Wrong OTP');
      setShowToast(true);
    }
  };

  // const handleExitEmailOtpScreen = () => {
  //   setShowEmailOtp(false);
  // };

  // const handleExitSmsOtpScreen = () => {
  //   setShowSmsOtp(false);
  // };

  // useEffect(() => {
  //   if (emailInputDisabled) {
  //     console.log('Email input disabled');
  //   }
  // }, [emailInputDisabled]);

  useEffect(() => {
    if (phoneNumberInputDisabled) {
      console.log('phoneNumber input disabled');
    }
  }, [phoneNumberInputDisabled]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleChange = (element, index) => {
    if (!isNaN(element.value)) {
      const newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);

      setSmsOtp(newOtp.join(''));

      const otpEntered = newOtp.join('');
      if (otpEntered.length === otp.length && /^[0-9]{6}$/.test(otpEntered)) {
        setIsOtpValid(true);
      } else {
        setIsOtpValid(false);
      }

      if (element.value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'BackSpace' && otp[index] === '') {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  const handleResendOtp = () => {
    setTimer(60);
    setIsResendDisabled(true);
    setShowSmsOtp(false);
    setPhoneNumber('');
    setIsPhoneNumberVerified(false);
    setSmsOtp('');
    formik.setFieldValue('phoneNumber', '');
  };
  const handleContinueRegistration = useCallback(() => {
   
    if (isEmailVerified && isPhoneNumberVerified) {
      console.log(isEmailVerified, isPhoneNumberVerified, "verified")
      onVerify({
        email: formik.values.email,
        phoneNumber: formik.values.phoneNumber,
      });
      closeModal();

 } else if (isEmailVerificationEnabled) {
    
      if (isEmailVerified) {
        

        onVerify({
          email: formik.values.email,
        });
        closeModal();
      } else {
        setToastMessage('Please verify your email to continue');
        setShowToast(true);
      }
    } else if (isSmsVerificationEnabled) {
      if (isPhoneNumberVerified) {
        onVerify({
          phoneNumber: formik.values.phoneNumber,
        });
        closeModal();
      } else {
        setToastMessage('Please verify your phone number to continue');
        setShowToast(true);
      }
    }
  },[isEmailVerified,
    isPhoneNumberVerified,
    isEmailVerificationEnabled,
    isSmsVerificationEnabled,
    formik.values.email,
    formik.values.phoneNumber,
    onVerify,
    closeModal,
    setToastMessage,
    setShowToast]);

//   useEffect(() => {
//     if (isPhoneNumberVerified || isEmailVerified) {
//       const timer = setTimeout(() => {
//         handleContinueRegistration();
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [isPhoneNumberVerified, isEmailVerified, handleContinueRegistration]);

useEffect(() => {
    if ((isEmailVerificationEnabled && !isEmailVerified) || (isSmsVerificationEnabled && !isPhoneNumberVerified)) {
 
      return; 
    }
  
    if (isPhoneNumberVerified || isEmailVerified) {
      const timer = setTimeout(() => {
        handleContinueRegistration();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPhoneNumberVerified, isEmailVerified, handleContinueRegistration, isEmailVerificationEnabled, isSmsVerificationEnabled]);

  
  return (
    <>
      {/* Email send OTP*/}

      <section className="pt-10 layout-pb-md">
        <div className="container">
          <div className="m-4">
            <form onSubmit={formik.handleSubmit}>
              {isSmsVerificationEnabled && (
                <div className="my-5">
                  {isPhoneNumberVerified ? (
                    <div className="text-center">
                      <img
                        src="/img/phone-icon.png"
                        alt="Phone Icon"
                        className="phone-icon"
                        style={{ height: '250px', marginBottom: '20px' }}
                      />
                      <h1 className="pt-5 verified-heading">
                        Successfully Verified
                      </h1>
                      <img
                        src="/img/otp-verified-tick.gif"
                        alt="verified"
                        className="otp-verified-gif"
                        style={{ height: '200px', marginTop: '20px' }}
                      />
                    </div>
                  ) : (
                    <div className="phoneNumber-container">
                      <div className="icon-container">
                        <img
                       src="/img/phone-icon.png"
                          alt="Phone Icon"
                          className="phone-icon"
                          style={{ height: '200px' }}
                        />
                      </div>

                      <h5 className="ph-mainHeading">Verify Mobile Number</h5>

                      <p className="ph-subheading">
                        {showSmsOtp
                          ? 'Enter the 6-digit code sent to your mobile number'
                          : 'Enter your mobile number to receive a verification code'}
                      </p>

                      <div className="input-container d-flex align-items-center justify-content-center mt-2 mb-3">
                        <div className="otp-input-style flex-grow-1">
                          {showSmsOtp ? (
                            <div
                              style={{ display: 'flex' }}
                              className="otp-input-container"
                            >
                              {otp.map((digit, index) => (
                                <input
                                  key={index}
                                  id={`otp-input-${index}`}
                                  type="tel"
                                  maxLength="1"
                                  value={digit}
                                  onChange={(e) => handleChange(e.target, index)}
                                  onKeyDown={(e) => handleKeyDown(e, index)}
                                  onFocus={() => handleFocus(`otp-input-${index}`)}
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    textAlign: 'center',
                                    fontSize: '20px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    backgroundColor: 'white',
                                  }}
                                />
                              ))}
                            </div>
                          ) : (
                            <input
                              type="tel"
                              id="phoneNumber-input"
                              className="form-control ph-custom-input rounded-pill text-center fw-bold"
                              value={formik.values.phoneNumber}
                              onChange={handlePhoneNumberChange}
                              onFocus={() => handleFocus('phoneNumber-input')}
                              onBlur={formik.handleBlur}
                              disabled={phoneNumberInputDisabled}
                              name="phoneNumber"
                              maxLength={10}
                              pattern="[0-9]*"
                              placeholder="10 digit mobile number"
                            />
                          )}
                        </div>
                      </div>

                      {formik.touched.phoneNumber &&
                        formik.errors.phoneNumber &&
                        !showSmsOtp && (
                          <div className="text-danger pt-2">
                            {formik.errors.phoneNumber}
                          </div>
                        )}

                      {isPhoneNumberVerified && !showSmsOtp && (
                        <span className="text-success ms-2 pt-2">Verified</span>
                      )}

                      {!isPhoneNumberVerified && (
                        <div className="d-flex justify-content-center mt-3 pt-5">
                          {showSmsOtp ? (
                            <button
                              className="verifyButton"
                              type="submit"
                              onClick={handleVerifySmsOtp}
                              disabled={!isOtpValid}
                              style={{
                                cursor: !isOtpValid ? 'not-allowed' : 'pointer',
                                opacity: !isOtpValid ? 0.5 : 1,
                              }}
                            >
                              Verify
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-primary ph-send-button"
                              onClick={handleSendSmsOtp}
                              disabled={
                                formik.values.phoneNumber.length !== 10 ||
                                formik.errors.phoneNumber ||
                                isPhoneNumberVerified ||
                                isSmsLoading
                              }
                            >
                              {isSmsLoading ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              ) : (
                                'Request Verification Code'
                              )}
                            </button>
                          )}
                        </div>
                      )}

                      {showSmsOtp && (
                        <p className="resendNote pt-5">
                          <span className="ms-3">{formatTime(timer)}</span>
                          <button
                            className={`resendBtn ${
                              !isResendDisabled ? 'enabled' : 'disabled'
                            }`}
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isResendDisabled}
                          >
                            Resend Code
                          </button>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {showToast && (
        <div
          className="toast align-items-center text-black border-2 position-fixed top-0 end-0 p-1 shadow show"
          role="alert"
          style={{ zIndex: 1050 }}
        >
          <div className="d-flex">
            <div className="toast-body">{toastMessage}</div>
            <button
              type="button"
              className="btn-close me-2 m-auto"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
        </div>
      )}

      {/* <div className="fixed-footer ">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleContinueRegistration}
        >
          Continue
        </button>
      </div> */}
    </>
  );
};
export default VerifyRunner;
