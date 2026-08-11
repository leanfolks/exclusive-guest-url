import React from 'react'
import { useState, useEffect } from 'react';
import Register from "../components/Registration/Register";
import Header from '../components/Header';
import { baseUrl } from "../apiConfig";
import axios from 'axios';
import { useParams } from 'react-router-dom';
//import { getEvents } from "../api/events";
import {useModal} from "../components/Registration/modal";
import VerifyRunner from '../components/Registration/VerifyRunner';
const BookingPage = () => {
  const { openModal,closeModal } = useModal();
  const [verificationData, setVerificationData] = useState(null);
  const [emailVerifyState,setEmailVerifyState] = useState(false);
  const [smsVerifyState,setSmsVerifyState] = useState(false);

  const handleVerificationData = (data) => {
    setVerificationData(data);
    
  };

  
  const {randomString} = useParams();
  const [regsitrationUrl, setRegistrationUrl] = useState("")
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState("");
  const [events, setEvents] = useState([]);
  console.log(eventsLoading, eventsError);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setEventsError("");
        setEventsLoading(true);
             const response = await axios.get(`${baseUrl}events/getAllEvents?status=OPENFORREGISTRATION,REGISTRATIONCLOSED`);
        setEvents(response?.data);
      } catch (error) {
        console.log("Error during fetching events", error);
        setEventsError(error.message);
      }
      finally {
        setEventsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(()=> {
    const fetchData = async()=>{
    const res = await axios.get(`${baseUrl}events/get-guesturl?randomString=${randomString}`)
    setRegistrationUrl(res.data);
    }
    fetchData();
    },[randomString])
    console.log(events, ":events")
    const event = events?.find(event=>event.id === regsitrationUrl?.eventId)
    
   // const [loading, setloading] = useState(false);
    
    useEffect(() => {
      const initializeVerification = async () => {
       
          setEmailVerifyState(event?.isEmailVerificationEnabled);
          setSmsVerifyState(event?.isSmsVerificationEnabled);
   
          if (event?.isEmailVerificationEnabled || event?.isSmsVerificationEnabled) {
            await openModal(
              <VerifyRunner
                closeModal={closeModal}
                onVerify={handleVerificationData}
                isEmailVerificationEnabled={event?.isEmailVerificationEnabled}
                isSmsVerificationEnabled={event?.isSmsVerificationEnabled}
              />
            );
          }
        }
    
      initializeVerification();
    }, [event, openModal, closeModal]);

    const renderSpinner = () => {
        return (
          <div
            className="text-center d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="spinner-border"></div>
          </div>
        );
      };

  return (
    <>
      <div className="header-margin"></div>

      <Header event={event} label={regsitrationUrl.label}/>
      {eventsLoading ? <> {renderSpinner()}</>
      :
      <section className="pt-10 layout-pb-md">
        <div className="container">
        <Register event={event} verificationData={verificationData}
        regsitrationUrl={regsitrationUrl}
         isEmailVerificationEnabled={emailVerifyState}
         isSmsVerificationEnabled={smsVerifyState}/>
</div>
</section>
}
</>
  )
}

export default BookingPage