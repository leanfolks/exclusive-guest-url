
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../apiConfig";
import { useFormik } from "formik";
import {Toast} from "react-bootstrap";
//import { useDispatch, useSelector } from "react-redux";
//import { setFormData, selectFormData } from "../../../features/form/formSlice";
import CustomerInfo from "./CustomerInfo";
import BibNumberDetails from "./BibNumberDetails";
import PaymentInfo from "./PaymentInfo";
import MerchandiseInfo from "./MerchandiseInfo";
import { IndianStates } from "../constants/IndianStates";
//import { getEvents } from "../../api/events";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
const Register = ({event, regsitrationUrl, runnerClub, runnerClubData, verificationData,isEmailVerificationEnabled,isSmsVerificationEnabled}) => {
 const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState(null);
//const location = useLocation();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const {randomString} = useParams();
  const [isLoading, setIsLoading] = useState(false);
  //const [categoryNames, setCategoryNames] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
  const [categoryMinimumAge, setCategoryMinimumAge] = useState(0);
  const [categoryMaximumAge, setCategoryMaximumAge] = useState(0);
console.log(isSubmittingForm, formSubmitted, categoryMaximumAge);

  useEffect(() => {
    const eventId = event ? event?.id : null;
      formik.setFieldValue("eventId", eventId);
    const runnerClubId = runnerClub ? runnerClub?.id : null;
    formik.setFieldValue("runnerClubId", runnerClubId);
    if (!runnerClub?.isEducationInstitution){
    formik.setFieldValue("runnerClub", runnerClub?.name);
    }
    else {
      formik.setFieldValue("educationInstitution", runnerClub?.name);
    }
    formik.setFieldValue("isOfflineTransaction", true);
  }, [event, runnerClub]);
  const calculateAge = useMemo(() => {
    return (dateOfBirth) => {
      const birthDate = new Date(dateOfBirth);
      const currentDate = event ? new Date(event?.date) : null;
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
  }, [event?.date]);

  // const createGenderObject = (categories) => {
  //   const genderObject = {};
    
  //   categories?.forEach(category => {
  //     genderObject[category.name] = category.gender;
  //   });
  //   return genderObject;
  // };
  // const genderObject = createGenderObject(event?.category);
  const [findCoupon, setFindCoupon] = useState(null);
   const fetchEarlyBird = async () => {
    try {
      const response = await axios.get(`${baseUrl}Coupons/getguestearlybirdcoupon?eventId=${event?.id}`);
      setFindCoupon(response.data);
    } catch (error) {
      console.log("Error during fetching coupon", error);
    }
  };

  useEffect(() => {
    if(event?.id){
    fetchEarlyBird();
    }
  }, [event]);
  
  useEffect(() => {
        if (!findCoupon) return;

  const expiry = new Date(findCoupon.expiresAt);
  expiry.setHours(23, 59, 59, 999); 
    if (findCoupon?.isActive === true && expiry >= new Date()) {
      formik.setFieldValue("couponCode", findCoupon.couponCode);
    }
  }, [findCoupon]);
   const generateCouponError = (message) => new Yup.ValidationError(message, null, 'couponCode');
  const validationSchema = Yup.lazy(() => {
    let schema = Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      guestBibNumber: Yup.string().required("Bib Number is required"),
      categoryName: Yup.string().required("Category Name is required"),
      ...(isEmailVerificationEnabled?{}:{ 
        email: Yup.string()
        .email("Invalid email")
        .required("Email is required")}),
        ...(isSmsVerificationEnabled? {}:{
          mobileNumber: Yup.string()
          .required("Mobile Number is required")
          .matches(/^(?!0|(\+91))\d{10}$/, {
            message: "Mobile Number should not start with 0 or +91 and should be 10 digits"
          })
        }),
        gender: Yup.string()
        .test(
          "valid-gender",
          function (gender) {
            const dateOfBirth = formik.values.dateOfBirth;
      
            const selectedCategory = event?.category?.find(cat => cat.name === formik.values.categoryName);
            if (!selectedCategory) {
              return this.createError({
                message: "Please select a category first.",
              });
            }
      
            const ageBracket = selectedCategory?.ageBracket;
            const age = calculateAge(dateOfBirth);
      
            if (!ageBracket || ageBracket.length === 0) {
              return this.createError({
                message: `No age brackets available for category ${formik.values.categoryName}.`,
              });
            }
            const genderNormalized = gender?.toUpperCase();
            const matchedBracket = ageBracket.find(bracket => {
              const isAgeInRange = age >= bracket.minimumAge && age <= bracket.maximumAge;
              return isAgeInRange;
            });
            const allowedGender = matchedBracket && matchedBracket.gender;
            if (genderNormalized !== allowedGender && allowedGender !== "BOTH" && matchedBracket) {
              return this.createError({
                message: `For selected Age: ${age}, the allowed gender in category ${formik.values.categoryName} is: ${allowedGender}.`,
              });
            }
            return true;
          }
        )
        .required("Gender is required"),
      dateOfBirth: Yup.date()
      .max(new Date(), "Date of Birth must be in the past")
      .test(
        "valid-age",
        function (date) {
          const selectedCategory = event?.category?.find(cat => cat.name === formik.values.categoryName);
          const ageBracket = selectedCategory?.ageBracket;
          const age = calculateAge(date);
          if (!ageBracket || ageBracket.length === 0) {
            return this.createError({
              message: `No age brackets available for category ${formik.values.categoryName}.`,
            });
          }
          const matchedBracket = ageBracket && ageBracket.find(bracket => {
            const isAgeInRange = age >= bracket.minimumAge && age <= bracket.maximumAge;
            return isAgeInRange;
          });
          if (!matchedBracket) {
            const ageRanges = ageBracket?.map(bracket => `${bracket.minimumAge}-${bracket.maximumAge}`).join(', ');
            return this.createError({
              message: `No matching age bracket for category ${formik.values.categoryName}. Allowed age ranges: ${ageRanges}`,
            });
          }
          
          return true;
        }
      )
      .required("Date of Birth is required"),
    //  nameOfTheBib: Yup.string().required("Name on the Bib is required"),
      bloodGroup: Yup.string().required("Blood Group is required"),
      contactName: Yup.string().required("Contact Name is required"),
      contactNumber: Yup.string()
    .required("Contact Number is required")
    .matches(/^(?!0|(\+91))\d{10}$/, {
      message: "Contact Number should not start with 0 or +91 and should be 10 digits"
    })
    .test('not-same-as-mobile', "Contact number and emergency contact number cannot be the same.", function(value) {
      return value !== this.parent.mobileNumber;
    }),
      //street: Yup.string().required("This field is required"),
      //city: Yup.string().required("This field is required"),
      pincode: Yup.string().required("Pincode is required"),
      //state: Yup.string().required("State is required"),
      //country: Yup.string().required("This field is required"),
      //address: Yup.string().required('Address is required'),
medicalIssue: Yup.string(),
      acceptedTerms: Yup.boolean()
        .oneOf([true], "You must agree to the terms")
        .required("You must agree to the terms"),
        ...(event?.slug === "mutthu-marathon-2025"
          ? {
              additionalTermsAndConditions: Yup.boolean()
                .oneOf([true], "You must agree to an additional terms and conditions")
                .required("You must agree to an additional terms and conditions"),
            }
          : {}),
      // couponCode: Yup.string().max(15, 'Coupon code must not exceed more than 10 letters'),
      
      couponCode: Yup.string()
      .max(15, 'Coupon code must not exceed 15 characters')
      .test('valid-coupon', '', async (value) => {
        if (!value) return true;
        if (findCoupon && value === findCoupon.couponCode) return true;
        // const isValidCoupon = coupon && coupon?.couponCode?.toLowerCase() === value?.toLowerCase();
        // if (!isValidCoupon) {
        //   throw generateCouponError('Invalid coupon');
        // }

if(formik.values.couponCode === "RHOCK10" && formik.values.educationInstitution !== "RHOCK HEALTH")
{
  throw generateCouponError('Invalid coupon');
}
if(formik.values.couponCode === "IDATVL10" && formik.values.educationInstitution !== "INDIAN DENTAL ASSOCIATION")
  {
    throw generateCouponError('Invalid coupon');
  }
  if(formik.values.couponCode === "PBIS20" && formik.values.educationInstitution !== "PUSHPALATA BRITISH INTERNATIONAL SCHOOL")
    {
      throw generateCouponError('Invalid coupon');
    }
    if(formik.values.couponCode === "PVM20" && formik.values.educationInstitution !== "PUSHPALATA VIDYA MANDIR, SENIOR SECONDARY SCHOOL")
      {
        throw generateCouponError('Invalid coupon');
      }
      if(formik.values.couponCode === "PMHS20" && formik.values.educationInstitution !== "PUSHPALATA MATRICULATION SCHOOL")
        {
          throw generateCouponError('Invalid coupon');
        }
        if(event?.slug === "rmkv-nellai-marathon-2025" && formik.values.couponCode === "SCHOOL20" && calculateAge(formik.values.dateOfBirth) >= 19)
          {
            throw generateCouponError('Invalid coupon');
          }
          if(event?.slug === "nandi-hill-monsoon-run" && formik.values.couponCode === "ntest10" && formik.values.greenWarrior !== "Opting for event organiser's transportation")
                                      {
                                       throw generateCouponError('Invalid coupon');
                                      }
                                           if(event?.slug === "nandi-hill-monsoon-run" && formik.values.couponCode === "ntest15" && formik.values.greenWarrior !== "Coming to the event by an EV (electric car)")
                                      {
                                       throw generateCouponError('Invalid coupon');
                                      }
                                            if(event?.slug === "nandi-hill-monsoon-run" && formik.values.couponCode === "ntest20" && formik.values.greenWarrior !== "Bringing your own bottle")
                                      {
                                       throw generateCouponError('Invalid coupon');
                                      }
        //   if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25KIRM" && formik.values.company !== 'TOYOTA KIRLOSKAR MOTOR')
        //     {
        //       throw generateCouponError('Invalid coupon');
        //   }
        //  if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "TBHMKOUSH" && formik.values.company !== 'TOYOTA KIRLOSKAR MOTOR')
        //     {
        //       throw generateCouponError('Invalid coupon');
        //  }
        //  if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "TBHMTKM50" && formik.values.company !== 'TOYOTA KIRLOSKAR MOTOR')
        //     {
        //       throw generateCouponError('Invalid coupon');
        //     }
        //     if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25BLTD" && formik.values.company !== 'BOSCH LTD')
        //       {
        //         throw generateCouponError('Invalid coupon');
        //       }
        //       if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25IBNK" && formik.values.company !== 'ICICI BANK')
        //         {
        //           throw generateCouponError('Invalid coupon');
        //         }
        //         if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25ILBD" && formik.values.company !== 'ICICI LOMBARD')
        //           {
        //             throw generateCouponError('Invalid coupon');
        //           }
        //           if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25COKA" && formik.values.company !== 'COCA COLA')
        //             {
        //               throw generateCouponError('Invalid coupon');
        //             }
        //          if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25MSWL" && formik.values.company !== 'MOTHER SON SUMI WIRES LTD')
        //         {
        //          throw generateCouponError('Invalid coupon');
        //         }
        //         if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25GLEN" && formik.values.company !== 'BGS GLENEAGLES')
        //           {
        //            throw generateCouponError('Invalid coupon');
        //           }
        //           if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25SHOS" && formik.values.company !== 'SPARSH HOSPITAL')
        //             {
        //              throw generateCouponError('Invalid coupon');
        //             }
        //             if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25STUD" && formik.values.company !== 'JOLLYWOOD STUDIOS AND ADVENTURES')
        //               {
        //                throw generateCouponError('Invalid coupon');
        //               }
        //               if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25TSIN" && formik.values.company !== 'TOYOTA TSUSHO INDIA PVT. LTD')
        //                 {
        //                  throw generateCouponError('Invalid coupon');
        //                 }
        //                 if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25TBIN" && formik.values.company !== 'TOYOTA BOSHOKU INDIA LTD')
        //                   {
        //                    throw generateCouponError('Invalid coupon');
        //                   }
        //                   if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25JBMX" && formik.values.company !== 'JBM')
        //                     {
        //                      throw generateCouponError('Invalid coupon');
        //                     }
        //                     if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25PMNT" && formik.values.company !== 'PARAMOUNT')
        //                       {
        //                        throw generateCouponError('Invalid coupon');
        //                       }
        //                       if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25TLKI" && formik.values.company !== 'TOYOTA LOGISTICS KISHOR INDIA PVT LTD')
        //                         {
        //                          throw generateCouponError('Invalid coupon');
        //                         }
        //                         if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25TTID" && formik.values.company !== 'TTID')
        //                           {
        //                            throw generateCouponError('Invalid coupon');
        //                           }
        //                           if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25ELIC" && formik.values.company !== 'ELCIA')
        //                             {
        //                              throw generateCouponError('Invalid coupon');
        //                             }
        //                             if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "BHM25ANBI" && formik.values.company !== 'ANTHEM BIO-SCIENCES')
        //                               {
        //                                throw generateCouponError('Invalid coupon');
        //                               }
        //                               if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "TBHMJJS50" && formik.values.runnerClub !== 'JAYANAGAR JAGUARS')
        //                                 {
        //                                  throw generateCouponError('Invalid coupon');
        //                                 }
        //                                 if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "TBHMPM50" && formik.values.runnerClub !== 'PACEMAKERS')
        //                                   {
        //                                    throw generateCouponError('Invalid coupon');
        //                                   }
        //                                   if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "TBHMRA50" && formik.values.runnerClub !== 'RUN ADDICTS')
        //                                     {
        //                                      throw generateCouponError('Invalid coupon');
        //                                     }
        //                                     if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "TBHMTLI100" && formik.values.company !== 'TLI')
        //                                       {
        //                                        throw generateCouponError('Invalid coupon');
        //                                       }
        //                                       if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "TBHMCTL100" && formik.values.company !== 'CATALER')
        //                                         {
        //                                          throw generateCouponError('Invalid coupon');
        //                                         }
        //                                         if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "TBHMTGS100" && formik.values.company !== 'TGSIN')
        //                                           {
        //                                            throw generateCouponError('Invalid coupon');
        //                                           }
        //                                           if(event?.slug === "toyota-bidadi-half-marathon-second-edition" && formik.values.couponCode === "TBHMTB50" && formik.values.runnerClub !== 'TRAILBLAZERS')
        //                                             {
        //                                              throw generateCouponError('Invalid coupon');
        //                                             }
        // if (coupon?.isActive === false || new Date(coupon?.expiresAt) < new Date()) {
        //   throw generateCouponError('Invalid Coupon');
        // }
        // if (formik.values.categoryName && coupon?.categories !== null && !coupon?.categories?.includes(formik.values.categoryName)) {
        //   throw generateCouponError(`This coupon is not valid for the selected category: ${formik.values.categoryName}`);
        // }

        // if (coupon?.gender !==null && formik.values.gender && coupon.gender !== formik.values.gender && coupon.gender !== 'Both') {
        //   throw generateCouponError(`This coupon is not valid for the selected gender: ${formik.values.gender}`);
        // }
        return true;
       }).when([], {
    is: () => event?.slug === "moonlight-kids-run-2026",
    then: schema => schema.required('Coupon code is required'),
    otherwise: schema => schema.notRequired()
      }),
      chronicIssues: Yup.string(),
      disorders: Yup.string(),
    });
    if (event?.slug !== "rmkv-saree-walkathon-2024" && event?.slug !== "nambi-odu-4.0") {
      schema = schema.concat(
        Yup.object().shape({
          tShirtSize: Yup.string().required("T-Shirt Size is required"),
          })
          )
    }
    if (formik?.values?.enableWhatsApp) {
      schema = schema.concat(
        Yup.object().shape({
          whatsAppNumber: Yup.string().required("WhatsApp Number is required")
          .matches(/^(?!0|(\+91))\d{10}$/, {
            message: "whatsApp Number should not start with 0 or +91 and should be 10 digits"
          }),
          })
          )
    }
    if (event?.slug === "mallai-marathon" && formik.values.categoryName === "3KM Couple Run") {
      schema = schema.concat(
        Yup.object().shape({
          spouseName: Yup.string().required("Spouse Name is required"),
          SpouseTShirtSize: Yup.string().required("Spouse T Shirt Size is required"),
          })
          )
    }
    if (event?.slug === "pochampalli-marathon-2025-2nd-edition") {
      schema = schema.concat(
        Yup.object().shape({
          freeReg: Yup.string().required("Coupon Code is required"),
          })
          )
    }
    if (event?.slug !== "kaapom-kalingarayan-marathon") {
      schema = schema.concat(
        Yup.object().shape({
          nameOfTheBib: Yup.string().required("Name on the Bib is required")
          .min(2, "Minimum 2 characters required")
          .max(16, "Maximum 16 characters allowed")
          .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Only alphabets (A-Z, a-z) are allowed. Single space allowed between words. No double spaces, numbers, or special characters.")
          ,
          })
          )
    }
      if (event?.slug === "bagmane-run-2025") {
      schema = schema.concat(
        Yup.object().shape({
          bibDistributionLocation: Yup.string().required("BIB Distribution Location is required"),
          })
          )
    }
    if (event?.slug === "bengaluru-runners-jatre" && formik.values.categoryName === "Open 10K") {
      schema = schema.concat(
        Yup.object().shape({
          isPriorityLineUp: Yup.string().required("Priority Line Up is required"),
          })
          )
    }
    if(event?.slug === "yellow-trackathon-2026" && (formik.values.categoryName === "6 Hours Team Run" || formik.values.categoryName === "6 Hours Buddy Run")) {
      schema = schema.concat(
        Yup.object().shape({
      teamName: Yup.string().required("Team Name is required"),
      teamContactPersonNumber: Yup.string().required("Team Contact Person Number is required")
      .matches(/^(?!0|(\+91))\d{10}$/, {
        message: "Contact Number should not start with 0 or +91 and should be 10 digits"
      }),
          })
          )
    }
    if (event?.slug === "bengaluru-runners-jatre"  && formik.values.categoryName === "Open 10K" && formik.values.isPriorityLineUp) {
      schema = schema.concat(
        Yup.object().shape({
          timingSubmission: Yup.string().required("Timing Submission is required"),
          garminLinks: Yup.string().required("Garmin Links is required"),
          jatreDistance: Yup.string().required("distance is required"),
          })
          )
    }
    if (event?.slug !== "bengaluru-runners-jatre") {
      schema = schema.concat(
        Yup.object().shape({
          state: Yup.string().required("State is required"),
          address: Yup.string().required("Address is required"),
          })
          )
    }
    if (event?.slug === "dhash-half-marathon" && randomString === 'e3d6da78c281') {
      schema = schema.concat(
        Yup.object().shape({
          employeeCode: Yup.string().required("Employee Code is required")
          })
          )
    }
     if (event?.slug === "namma-run-2025" && randomString === '9cfdfa1e13fb') {
      schema = schema.concat(
        Yup.object().shape({
          occupation: Yup.string().required("Store Name is required")
          })
          )
    }
    if (event?.slug === "bengaluru-runners-jatre" && runnerClub?.name === "Police") {
      schema = schema.concat(
        Yup.object().shape({
          policeStation: Yup.string().required("Police Station is required"),
          })
          )
    }
    return schema;
  });
const [showModal, setShowModal] = useState(false)
const parseDOB = (dateString) => {
  if (!dateString) return "";

  if (dateString instanceof Date) {
    return dateString;
  }

  const [day, month, year] = dateString.split("/");

  if (!day || !month || !year) {
    return "";
  }

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );
};
const [hasPrefilledMerchandise, setHasPrefilledMerchandise] = useState(false);
const getParticipantByBibNumber = async () => {
  const bibNumber = formik.values.guestBibNumber?.trim();

  if (!bibNumber) {
    formik.setFieldTouched("guestBibNumber", true);
    return false;
  }

  try {
    setIsLoading(true);

    const response = await axios.get(
      `${baseUrl}events/get-participant`,
      {
        params: {
          eventId: event?.id,
          bibNumber: bibNumber,
        },
      }
    );

    const participant =
      response?.data?.data || response?.data?.participant || response?.data;

    if (participant) {
      console.log("Participant found:", participant);

   
      const fieldsToPopulate = [
        "firstName",
        "lastName",
        "email",
        "mobileNumber",
        "gender",
        "dateOfBirth",
        "tShirtSize",
        "nameOfTheBib",
        "bloodGroup",
        "contactName",
        "contactNumber",
        "address",
        "city",
        "pincode",
        "state",
        "country",
        "medicalIssue",
        "categoryName",
        "runnerClub",
        "runnerClubId",
        "educationInstitution",
        "spouseName",
        "SpouseTShirtSize",
        "policeStation",
        "occupation",
        "employeeCode",
        "bibDistributionLocation",
        "teamName",
        "teamContactPersonNumber",
        "isPriorityLineUp",
        "timingSubmission",
        "garminLinks",
        "jatreDistance",
        "merchandiseId",
         "whatsAppNumber"
      ];

      fieldsToPopulate.forEach((field) => {
        if (
          participant[field] !== undefined &&
          participant[field] !== null &&
          participant[field] !== ""
        ) {
          formik.setFieldValue(field, participant[field], false);
        }
      });
const prefilledMerchandise =
  participant.merchandiseId !== undefined &&
  participant.merchandiseId !== null &&
  participant.merchandiseId !== "";


setHasPrefilledMerchandise(prefilledMerchandise)
const hasWhatsAppNumber =
  participant.whatsAppNumber !== undefined &&
  participant.whatsAppNumber !== null &&
  participant.whatsAppNumber !== "";

formik.setFieldValue(
  "enableWhatsApp",
  hasWhatsAppNumber,
  false
);

formik.setFieldValue(
  "whatsAppNumber",
  hasWhatsAppNumber
    ? participant.whatsAppNumber
    : "",
  false
);
if (participant.dateOfBirth) {
  formik.setFieldValue(
    "dateOfBirth",
    parseDOB(participant.dateOfBirth),
    false
  );
}
if (participant?.state) {
  const participantState = participant.state.trim();

  const matchedState = IndianStates.find(
    (state) =>
      state.toLowerCase() === participantState.toLowerCase()
  );

  formik.setFieldValue(
    "state",
    matchedState || participantState,
    false
  );
}
      formik.setFieldValue(
        "guestBibNumber",
        bibNumber,
        false
      );

      setFormValues({
        ...participant,
        guestBibNumber: bibNumber,
      });

      return true;
    }
 setHasPrefilledMerchandise(false);
    return false;
  }  catch (error) {
  console.log(
    "Participant not found:",
    error?.response?.data || error
  );

  const errorMessage =
    error?.response?.data?.error ||
    "No participant found for this Bib Number.";

  setToastVariant("danger");
  setToastMessage(errorMessage);
  setShowToast(true);

  formik.setFieldValue(
    "guestBibNumber",
    bibNumber,
    false
  );

  setFormValues({
    guestBibNumber: bibNumber,
  });
  setHasPrefilledMerchandise(false);
  return false;
} finally {
    setIsLoading(false);
  }
};
const [merchandise, setMerchandise] = useState([]);
const [existingItems, setExistingItems] = useState([])
 useEffect(()=> {
    if (!event?.id) return; 
  const fetchMechandise = async() => {

    try {
      const response = await axios.get(`${baseUrl}events/merchandise-products?eventId=${event?.id}`)
      setMerchandise(response?.data);
    } catch (error) {
      console.error(error);
  } 
  
}
fetchMechandise();
 }, [event?.id])

useEffect(() => {
  if (hasPrefilledMerchandise) {
    formik.setFieldValue("IsGuestOptedAddon", true, false);
  }
}, [hasPrefilledMerchandise]);
  const [verifyCouponLoading, setVerifyCouponLoading] = useState(false);
const handleCouponVerify = async () => {
  try {
    setVerifyCouponLoading(true);
    const res = await axios.post(
      `${baseUrl}users/verify-guestcoupon`,
      {
        couponCode: formik.values.couponCode,
        eventId: event?.id,
        runnerClub: formik.values.runnerClub,
        categoryName: formik.values.categoryName,
        gender: formik.values.gender
      }
    );

    if (res.data.valid) {
      return true;
    }
  formik.setFieldTouched("couponCode", true, false);
    formik.setFieldError(
      "couponCode",
      res.data.message || "Coupon is invalid"
    );

    return false;

  } catch (err) {
    formik.setFieldTouched("couponCode", true, false);
    formik.setFieldError(
      "couponCode",
      err?.response?.data?.message ||
      "Something went wrong while verifying"
    );

    return false;

  } finally {
    setVerifyCouponLoading(false);
  }
};

    const formik = useFormik({
      initialValues: {
        firstName: formValues?.firstName || "",
        lastName: formValues?.lastName || "",
        email: formValues?.email || "",
        mobileNumber: formValues?.mobileNumber || "",
        gender: formValues?.gender || "",
        dateOfBirth: formValues?.dateOfBirth || "",
        tShirtSize: formValues?.tShirtSize || "",
        nameOfTheBib: formValues?.nameOfTheBib || "",
        bloodGroup: formValues?.bloodGroup || "",
        contactName: formValues?.contactName || "",
        contactNumber: formValues?.contactNumber || "",
        guestBibNumber: formValues?.guestBibNumber || "",
          merchandiseId: formValues?.merchandiseId || null,
        street: "",
        address: formValues?.address || "",
        city: formValues?.city || "",
        pincode: formValues?.pincode || "",
        state: formValues?.state || "",
        country: "",
        medicalIssue: formValues?.medicalIssue || "",
        categoryName: formValues?.categoryName || "",
        acceptedTerms: formValues?.acceptedTerms || "",
        additionalTermsAndConditions: formValues?.additionalTermsAndConditions || false,
        couponCode: formValues?.couponCode || "",
        addNewQuestion: formValues?.addNewQuestion || "",
        enableWhatsApp: formValues?.enableWhatsApp || false,
        whatsAppNumber: formValues?.whatsAppNumber || "",
        spouseName: formValues?.spouseName || "",
        SpouseTShirtSize: formValues?.SpouseTShirtSize || "",
        policeStation: formValues?.policeStation || "",
      },
  validationSchema: validationSchema,
    onSubmit: async (values, {setSubmitting, resetForm}) => {
      try {
        setIsSubmittingForm(true);
        setIsLoading(true);
        const age = calculateAge(values.dateOfBirth);
        const nameOfTheBib = values?.nameOfTheBib ? values?.nameOfTheBib : values?.firstName; 
     //   values.dateOfBirth = `${values.dateOfBirth.getFullYear()}-${values.dateOfBirth.getMonth() + 1}-${values.dateOfBirth.getDate()}`
        const response = await axios.post(`${baseUrl}users/register`, { ...values, age, nameOfTheBib, whatsAppNumber: values?.enableWhatsApp ? values?.whatsAppNumber : values?.mobileNumber, freeReg: "Exclusive Guest Registration" });   
        if (response.status === 200) {
          const data = response.data.data;
          //if(data.amount > 0) {
            setFormValues(data)
            setFormSubmitted(true);
              setCurrentStep(steps.length - 1);
             //} 
          // else {
          //   window.location.href = `https://www.novarace.in/pages/success/${data.id}`
          // }
          
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const errorData = await response.json();
          console.error("Runner registration failed:", errorData);
          setToastVariant("danger");
          setToastMessage("Runner registration Failed");
          setTimeout(() => {
            setShowToast(false);
          }, 3000)
          setShowToast(true);
          setFormSubmitted(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } 
      } catch (error) {        
        setToastVariant("danger");        
        setToastMessage(error.response?.data?.error);
        setShowToast(true);
        setFormSubmitted(true);
      }
      finally {
        setIsLoading(false);
        setIsSubmittingForm(false);
        setSubmitting(false);
      }
      },
    
  });
  useEffect(() => {
    if (!formik.values.isPriorityLineUp) {
      formik.setFieldValue("timingSubmission", "");
      formik.setFieldValue("garminLinks", "");
      formik.setFieldValue("jatreDistance", "");
    }
   }, [formik.values.isPriorityLineUp]);
     useEffect(() => {
    if (event?.slug === "yellow-trackathon-2026" && (formik.values.categoryName === "6 Hours Solo Run" || formik.values.categoryName === "100M" || formik.values.categoryName === "400M")) {
      formik.setFieldValue("teamName", "");
      formik.setFieldValue("teamContactPersonNumber", "");
    }
   }, [event, formik.values.categoryName]);
  useEffect(() => {
    if(formik.values.categoryName !== "Open 10K")
    formik.setFieldValue("isPriorityLineUp", null);
  }, [formik.values.categoryName])
  useEffect(() => {
    if(formik.values.categoryName !== "3KM Couple Run")
    formik.setFieldValue("spouseName", "");
    formik.setFieldValue("SpouseTShirtSize", "");
  }, [formik.values.categoryName])
  useEffect(() => {
    if (event && formik.values.categoryName) {
      const selectedCategory = event.category.find(cat => cat.name === formik?.values?.categoryName);
      if (selectedCategory) {
        setCategoryMinimumAge(selectedCategory.minimumAge);
        setCategoryMaximumAge(selectedCategory.maximumAge);
const distance = selectedCategory.distance;
formik.setFieldValue("distance", distance);

      }
    }
  }, [event, formik.values.categoryName]);
  const [matchedAgeBracket, setMatchedAgeBracket] = useState('');
  useEffect(() => {
    const age = formik.values.dateOfBirth && calculateAge(formik.values.dateOfBirth);
    const gender = formik.values.gender;
if (event?.category) {
  const selectedCategory = event.category.find((cat) => cat.name === formik.values.categoryName);

  if (selectedCategory && selectedCategory.ageBracket && formik.values.dateOfBirth) {
    const matchedBracket = selectedCategory.ageBracket.find((bracket) => {
      const isAgeInRange = age >= bracket.minimumAge && age <= bracket.maximumAge;
      const isGenderMatch = bracket.gender === "BOTH" || bracket.gender === gender.toUpperCase();

      return isAgeInRange && isGenderMatch;
    });
          if (matchedBracket) {
            setMatchedAgeBracket(`You are registering in the ${matchedBracket.name} category of ${formik.values.categoryName}`);
          }
          else
          {
            setMatchedAgeBracket(`You are ineligible for ${formik.values.categoryName}. Please choose a different category`)
          }
  }
      
    }

  }, [formik.values.dateOfBirth, formik.values.gender, event]);
  useEffect(() => {
    setMatchedAgeBracket('');
  }, [formik.values.categoryName]);
  const isMatched = matchedAgeBracket?.startsWith('You are registering in');
//   const handleFormSubmit = (data) => {
//     setCompletedAllSteps(true);

// setCurrentStep(currentStep + 1);
//   };
console.log(formValues, "formValues in register")

const [errorList, setErrorList] = React.useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
    const nextStep = () => {
    if (formik.isValid) {
      formik.handleSubmit();
    }
  };
 const handleRegisterClick = async () => {
  setButtonClicked(true);

  if (currentStep === 0) {
    const bibNumber =
      formik.values.guestBibNumber?.trim();

    if (!bibNumber) {
      formik.setFieldTouched(
        "guestBibNumber",
        true,
        true
      );

      await formik.validateForm();
      return;
    }

      const participantFound = await getParticipantByBibNumber();

  if (!participantFound) {
    setButtonClicked(false);
    return;
  }

    setCurrentStep(1);

    setButtonClicked(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    return;
  }

  const errors = await formik.validateForm();

  if (Object.keys(errors).length === 0) {
    if(!event?.isMerchandiseEnabled) {
        nextStep();
        }
        else {
          setCurrentStep(currentStep+1)
        }
    setButtonClicked(false);
  } else {
    formik.setTouched({
      ...formik.touched,
      ...Object.keys(errors).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {}),
    });
  }
};


const renderSpinner = () => {
  return (
    <div className="text-center d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
     <div className="spinner-border"></div>
    </div>
  );
};
  const steps = [
    {
      title: "Bib Number Details",
      stepNo: "1",
      stepBar: (
        <>
        </>
      ),
      content:  <BibNumberDetails
         eventCategory = {event}
         registrationUrl={regsitrationUrl}
         categoryMinimumAge={categoryMinimumAge}
         formik={formik}
        // categoryNames={categoryNames} 
         customSlug={event?.slug}
         eventId={event?.id}     
           onBibLookup={getParticipantByBibNumber}    
         matchedAgeBracket={matchedAgeBracket}     
         isMatched={isMatched}    
         randomString={randomString}
         verificationData={verificationData}   
         isEmailVerificationEnabled={isEmailVerificationEnabled}
         isSmsVerificationEnabled={isSmsVerificationEnabled} 
         />
    },
        {
      title: "Personal Details",
      stepNo: "2",
      stepBar: (
        <>
        </>
      ),
      content:  <CustomerInfo
         eventCategory = {event}
         findCoupon={findCoupon}
         registrationUrl={regsitrationUrl}
         categoryMinimumAge={categoryMinimumAge}
         formik={formik}
        // categoryNames={categoryNames} 
         customSlug={event?.slug}         
         matchedAgeBracket={matchedAgeBracket}     
         isMatched={isMatched}    
         randomString={randomString}
         verificationData={verificationData}   
         isEmailVerificationEnabled={isEmailVerificationEnabled}
         isSmsVerificationEnabled={isSmsVerificationEnabled} 
         />
    },
    ...(event?.isMerchandiseEnabled
      ? [
          {
            title: "Merchandise",
            stepNo: "3",
            stepBar: <></>,
            content: <MerchandiseInfo
              merchandise={merchandise}
              formValues={formValues}
              hasPrefilledMerchandise={hasPrefilledMerchandise}
              event={event}
              formik={formik}
              nextStep={nextStep}
              currentStep={currentStep}
              setExistingItems={setExistingItems}
              setCurrentStep={setCurrentStep}
          />
          },
        ]
      : []),
     {
    title: "Payment",
      stepNo: event?.isMerchandiseEnabled ? "4" : "3",
    content: (
      <PaymentInfo
        formik={formik}
         formValues={formValues}
        event={event}
           existingItems={existingItems}
        merchandise={merchandise}

      />
    ),
  },
  ];
 const renderStep = () => {
    const { content } = steps[currentStep];
    return <>{content}</>;
  };

  useEffect(()=>{
    isLoading && 
    window.scrollTo({ top: 0, behavior: "smooth" });
    
  }, [isLoading])

  useEffect(() => {
    const updatedErrors = Object.keys(formik.errors);
    setErrorList(updatedErrors);
  }, [formik.errors]);
  return (
    <>
    <style>
      {
        `@media (max-width: 768px) {
  .mobile-width {
    width: 100%;
  }
}
        `
      }
    </style>
      {/*<div className="row x-gap-40 y-gap-30 items-center mt-3">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="col-4">
              <div
                className="d-flex items-center transition">
                <div
                  className={
                    currentStep === index
                      ? "active size-40 rounded-full flex-center bg-blue-1"
                      : "size-40 rounded-full flex-center bg-blue-1-05 text-blue-1 fw-500"
                  }
                >
                  {currentStep === index ? (
                    <>
                      <i className="icon-check text-16 text-white"></i>
                    </>
                  ) : (
                    <>
                      <span>{step.stepNo}</span>
                    </>
                  )}
                </div>

                <div className="text-18 fw-500 ml-10"> {step.title}</div>
              </div>
            </div>

            {step.stepBar}
          </React.Fragment>
        ))}
                  </div> */}
   {isLoading ? (
     <> {renderSpinner()}</>
      ):
      <>
      <div className="row " >{renderStep()}</div>   
      
      <div className="row x-gap-20 y-gap-20 pt-10">
 
        {/*<div className="col-auto">
          <button
            className="button h-60 px-24 -blue-1 bg-light-2"
            disabled={currentStep === 0}
            onClick={previousStep}
          >
            Previous
          </button>
                  </div> */}
      

                  <div className="">
               {buttonClicked && errorList.length > 0 && (
            <div className="error-list">
              <ul className="list-disc">
                {errorList.map((field, index) => (
                  <li className="text-danger" key={index}>
        {formik.errors[field] ? formik.errors[field] : `${field} is required`}
      </li>
                ))}
              </ul>
            </div>
          )}
          {(currentStep === 0  || currentStep === 1)  &&
          <div className="d-flex justify-content-center">
           <button
  type="button"
  className="btn btn-primary mobile-width h-60 px-24 -dark-1 bg-blue-1 text-white my-3"
  onClick={async () => {
    if (event?.isMerchandiseEnabled && formik.values.couponCode && currentStep !== 0) {
      const validCoupon = await handleCouponVerify();
      if (!validCoupon) {
      return;
        }
    }
    //  if (event?.isMerchandiseEnabled && formik.values.PersonalisedBibNumber) {
    //   const validBibNumber = await handleBibVerify();
    //   if (!validBibNumber) {
    //   return;
    //     }
    // }
    handleRegisterClick();
  }}
      disabled={(event?.slug === "stick-to-safety-marathon" || event?.slug === "gadinadu-sports-club-lake-run-2026") && formik.values.membershipId && !formik.values.isSpecialNeeds}       
             
>
  {isLoading
    ? "Checking..."
    : currentStep === 0
      ? "Continue"
      : "Register"}
</button>
    </div>
}
    {/* <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {`Your entry is taken and you will get registration confirmation as soon as the organiser confirms${event?.slug === "dhash-half-marathon" ? "." : " the payment status. Please contact organiser."}`}
          </Modal.Body>
      </Modal> */}
                  </div>    
          
      </div>
      <div style={{ position: "absolute", top: "100px", right: "10px" }}>
    <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={5000}
        autohide
        className={`bg-${toastVariant}`}
      >
        <Toast.Header closeButton={true} className="d-flex justify-content-between align-items-center">
          <strong className="mr-auto">Registration</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
      </div>
</>
}
      </>
  );
};

export default Register;
