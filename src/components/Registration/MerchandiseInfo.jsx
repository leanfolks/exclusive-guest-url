import React, { useEffect, useState } from 'react';
import { Toast } from "react-bootstrap";
import axios from 'axios';
import { Modal, Button} from 'react-bootstrap';

const MerchandiseInfo = ({ payAmount, formValues, formik, nextStep, event, merchandise, currentStep, setCurrentStep, hasPrefilledMerchandise }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
  //const [selectedTShirtSize, setSelectedTShirtSize] = useState("");
  const [tShirtSizes, setTShirtSizes] = useState({});
  const [tShirtAlert, setTShirtAlert] = useState(false); 
  const [selectedMerchandiseId, setSelectedMerchandiseId] = useState(null);
  const [membershipIdInput, setMembershipIdInput] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isHovered, setIsHovered] = useState(false);
  const handleMerchandiseSelect = (merchandiseId, itemName) => {
    if (selectedMerchandiseId === merchandiseId) {
    setSelectedMerchandiseId(null);
    formik.setFieldValue("merchandiseId", null);
    formik.setFieldValue("shuttlePickupPoint", null);
  }
    else {
    setSelectedMerchandiseId(merchandiseId);
    formik.setFieldValue("merchandiseId", merchandiseId);
    }
    // if (itemName !== "T-ShirtIadvl") {
    //   setMembershipIdInput("");
    //   formik.setFieldValue("membershipId", "")
    // }
    setTShirtSizes({})
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const hoverDivStyles = {
    color: isHovered ? '#dc3545' : '#007bff',
    textDecoration: isHovered ? 'underline' : '',
  };
  const handleTShirtSizeChange = (merchandiseId, size) => {
    setTShirtSizes((prev) => ({ ...prev, [merchandiseId]: size }));
    if (merchandiseId === selectedMerchandiseId) {
      formik.setFieldValue("tShirtSize", size);
    }
  };
  const handleMembershipIdChange = (e) => {
    setMembershipIdInput(e.target.value); 
    formik.setFieldValue("membershipId", e.target.value);
  };
  const [alert, setAlert] = useState(false)
const [alertFormat, setAlertFormat] = useState(false)
const handleSubmit = async () => {
  nextStep();
};
  const handleButtonClick = () => {
    nextStep();
    };
    useEffect(() => {
      if (selectedMerchandiseId && event?.slug === "nandi-hill-monsoon-run") {
        
    if (!formik.values.shuttlePickupPoint) {
      setAlert(true);
    } else {
      setAlert(false);
    }
  } else {
    setAlert(false);
  }  
      

    }, [selectedMerchandiseId, formik.values.shuttlePickupPoint, event?.slug]);
    useEffect(() => {
      if (merchandise[0]?.name === "T-ShirtIadvl") {
        const isValidFormat = /^[A-Z]{2}\/[A-Z]{2}\/\d{4}$/.test(membershipIdInput) ||
        /^X{2}\/X{2}\/1234 \(LM\)$/.test(membershipIdInput) ||
        /^X{3}\/X{2}\/1234 \(PLM\/ ALM\)$/.test(membershipIdInput) ||
        /^X{2}\/X{2}\/12345 \(LM\)$/.test(membershipIdInput) ||
        /^X{3}\/X{2}\/12345 \(PLM\/ ALM\)$/.test(membershipIdInput);
        if (!isValidFormat) {
          setAlert(true);  
        } else {
          setAlert(false); 
        }
      }
    }, [membershipIdInput, merchandise]);
    useEffect(() => {
      if (merchandise[0]?.name === "T-ShirtIadvl") {
        const isValidFormat = /^[A-Z]{3}\/[A-Z]{2}\/\d{5}$/.test(membershipIdInput);
        if (!isValidFormat) {
          setAlertFormat(true);  
        } else {
          setAlertFormat(false); 
        }
      }
    }, [membershipIdInput, merchandise]);
    useEffect(() => {
      if (selectedMerchandiseId && !tShirtSizes[selectedMerchandiseId]) {
        setTShirtAlert(true);
      } else {
        setTShirtAlert(false);
      }
    }, [tShirtSizes, selectedMerchandiseId]);

    return (
    <>
      <style>
        {
          `.table {
            white-space: nowrap;
          }`
        }
      </style>
      <div className='container mt-20'>
        <h3 className='text-center'> Add ons</h3>

        <div className="form-group form-input m-2 px-3 mx-auto">
          {merchandise?.length > 0 && merchandise?.map((item, index) => (
            <div key={index} className="row justify-content-center my-3 mx-auto w-75 w-xl-50 w-xxl-50"
            style={{
              minHeight: "120px",
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              padding: '1em 0em',
              transition: 'box-shadow 0.3s ease',
            }}
            >
              {event?.slug === "the-sarjapura-run-2026" &&
              <div className=''>
The 'Border Double' Challenge<br/>
The Border Double is a premium endurance challenge designed for runners who want to conquer two of the region's most scenic routes in a single season.
<ul className='mx-3'>
  <li style={{"list-style-type": "disc"}}>Eligibility & Sequence:</li>
<li style={{"list-style-type": "disc"}}> Exclusively available to runners who successfully finish both the Lake Run 3.0 and the Sarjapura Run 1.0 (scheduled for the 1st or 2nd Sunday of December) in the same calendar year.</li>
<li style={{"list-style-type": "disc"}}> Participation must be consecutive; missing one event disqualifies the runner from the 'Border Double' status.</li>
<li style={{"list-style-type": "disc"}}> Rewards & Recognition:</li>
<li style={{"list-style-type": "disc"}}> The Finisher's Kit: Upon crossing the finish line at the Sarjapura Run, eligible runners will receive a custom 'Border Double' Special Medal (often a "interlocking" design that connects to previous medals).</li>
<li style={{"list-style-type": "disc"}}> Exclusive Apparel: A limited-edition Finisher T-shirt or technical hoodie featuring the 'Border Double' branding.</li>
<li style={{"list-style-type": "disc"}}> Premium Goodies: A curated bag of high-performance gear or local partner products.</li>
<li style={{"list-style-type": "disc"}}> Registration & Tracking:</li>
<li style={{"list-style-type": "disc"}}> Automatic Enrollment: Runners who register for both events using the same Email/Phone number are automatically flagged for the challenge.</li> 
<li style={{"list-style-type": "disc"}}> Verification: Eligibility is verified via the official timing chips from both race locations.</li>
<li style={{"list-style-type": "disc"}}> The "Border" Experience:</li>
<li style={{"list-style-type": "disc"}}> VIP Lounge: Access to a dedicated 'Border Double' recovery zone at the Sarjapura finish line, featuring specialized physio support and refreshments.</li>
<li style={{"list-style-type": "disc"}}> Wall of Fame: Digital and physical recognition of all "Double" finishers on the official event websites and social media</li>
</ul>
                </div>
}
{hasPrefilledMerchandise &&
<div className='fw-bold'>You have already selected this addon during your previous Lake Run registration. It cannot be selected again. Please skip this addon to proceed with your registration.</div>
}
              <div className="col-md-5">
                <div className='d-flex gap-2 align-items-start gap-3'>
                  <div>
                    <input
                      type="radio"
                      name="merchandiseId"
                      className="custom-control-input large-radio"
                      required
                      onClick={() => handleMerchandiseSelect(item.id, item.name)}
                    checked={selectedMerchandiseId === item.id}
                    />
                  </div>
                  <div className='mt-2'>
                    <p className='fw-700'>
                      {/* {item.name === "T-ShirtIadvl" ? "T-Shirt - IADVL members only" : "T-Shirt - Non IADVL members"} */}
                      {item.name}
                    </p>
                    <p>{item?.price === 0 ? "FREE" : (<><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M13.725 21L7 14v-2h3.5q1.325 0 2.288-.862T13.95 9H6V7h7.65q-.425-.875-1.263-1.437T10.5 5H6V3h12v2h-3.25q.35.425.625.925T15.8 7H18v2h-2.025q-.2 2.125-1.75 3.563T10.5 14h-.725l6.725 7z"></path></svg> {item?.price}</>)}</p>
                    {/* <p className='text-14'>
                      {item.name === "T-ShirtIadvl" ? 
                        "Please select this option ONLY if you are an IADVL member. Free T-shirt will be provided only after the membership ID is physically verified during BIB distribution" : 
                        "Non IADVL members can purchase the event Tshirt (Drifit) which is optional"}
                    </p> */}
                       {event?.slug === "bluemountrunners10k2026" &&
                    <>
                    <p>☐ Yes, add an Event T-shirt (+₹100)</p>
<p>☐ No, continue without a T-shirt</p>
</>
}
                  </div>
                </div>
                {selectedMerchandiseId === item.id && item?.name === "T-ShirtIadvl" && 
                <div className='form-input form-group'>
<label className='fw-bold'>Membership Id <span className='text-danger'>*</span></label>
                <input
              type="text"
              className="form-control p-2 custom-placeholder"
              placeholder="Enter your Membership ID"
              value={membershipIdInput}
              onChange={handleMembershipIdChange}
              required
            />
                        {selectedMerchandiseId === merchandise[0]?.id && alert && alertFormat &&
            <div className='text-danger role'>
              Allowed formats: LM/KN/6406, ALM/KN/64064, XX/XX/1234 (LM), XXX/XX/1234 (PLM/ ALM), XX/XX/12345 (LM) and XXX/XX/12345 (PLM/ ALM)
              </div>
            }
            </div>
          }

          {item.name === "Opt for Shuttle Service" && event?.slug === "nandi-hill-monsoon-run" && selectedMerchandiseId === item.id && (
              <div className="form-group mt-2">
                <label className="fw-bold">Select Shuttle Pickup Point</label>
                <select
                  className="form-select"
                  name="shuttlePickupPoint"
                  onChange={(e) => formik.setFieldValue("shuttlePickupPoint", e.target.value)}
                  value={formik.values.shuttlePickupPoint || ""}
                  required
                >
                  <option value="">Please Select</option>
                  <option value="Marathahalli">Marathahalli</option>
                  <option value="Central Bengaluru">Central Bengaluru (Kanteerava or nearby)</option>
                  <option value="South Bengaluru">South Bengaluru (Jayanagar or nearby)</option>
                </select>
              </div>
            )}
             {alert &&
            <div className='text-danger role'>
              Please Select Shuttle Pickup Point
              </div>
            }
          </div>

              {event?.slug === "bluemountrunners10k2026" &&
 <div className='col-md-4 mt-2'>
              <select 
  id={`tshirtsize-${item.id}`} 
  className="p-2 form-select text-black" 
  name={`tShirtSizes.${item.id}`} 
  onChange={(e) => handleTShirtSizeChange(item.id, e.target.value)}
  disabled={selectedMerchandiseId !== item.id}
  value={tShirtSizes[item.id] || ""}
                  style={{ width: "100%", padding: "0.4em", borderRadius: "7px", outline: "none" }}
                >
                  <option value="">Please Select</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                    <option value="3XL">3XL</option>
                    <optgroup label="Kids">
                <option disabled>───────────</option>
                       <option value="2-4 Yrs 24 inches">2-4 Yrs 24 inches</option>
                <option value="4-5 Yrs 26 inches">4-5 Yrs 26 inches</option>
                   <option value="5-7 Yrs 28 inches">5-7 Yrs 28 inches</option>
                <option value="7-8 Yrs 30 inches">7-8 Yrs 30 inches</option>
                <option value="8-10 Yrs 32 inches">8-10 Yrs 32 inches</option>
               </optgroup>
                </select>
                {tShirtAlert && selectedMerchandiseId === item.id && !tShirtSizes[item.id] && (
                  <div className="text-danger mt-1">Please select a T-shirt size.</div>
                )}
                <div variant="primary" onClick={handleShow} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`pointer`} style={hoverDivStyles}>
                  Size Chart <i className="icon-chevron-sm-down text-12"></i>
              </div>
              <TShirtSizeModal show={show} handleClose={handleClose} eventCategory={event} />
            
              </div> 
}
            </div>
          ))}
          <div className='d-flex justify-content-center flex-column flex-md-row align-items-center gap-1 gap-md-3'>
            <button className='btn btn-lg btn-primary' disabled={hasPrefilledMerchandise || !selectedMerchandiseId || alert || (event?.slug === "bluemountrunners10k2026" && tShirtAlert)} onClick={handleSubmit}>Continue and checkout</button>
            <button className='btn btn-lg btn-danger' onClick={handleButtonClick}
            disabled={selectedMerchandiseId}
            >Skip and checkout</button>
            
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
      </div>
    </>
  );
};

export default MerchandiseInfo;
const TShirtSizeModal = ({ show, handleClose, customSlug, eventCategory }) => {
  return (
    <>
    <style>
      {
        `
        @media (max-width: 576px) {
  .nowrap-table th,
  .nowrap-table td {
    white-space: nowrap;
  }
}
        `
      }
    </style>
  <Modal show={show} onHide={handleClose} size="xl">
  <Modal.Header closeButton className='bg-blue-2'>
    <Modal.Title>Size Chart</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  {eventCategory?.tShirtSizeChart ?
    <div className="text-center">
    <img src={eventCategory?.tShirtSizeChart} alt="" />
    </div>
    :
    
  <div className="table-responsive">
<table className="table table-striped border mx-auto nowrap-table">
  {eventCategory?.slug !== "metro-kidathon-2025" && eventCategory?.slug !== "jumpathon-4.0" &&
<thead>
  {eventCategory?.slug === "perambalur-marathon" ?
  <>
<tr>
  <th colSpan={4} className='py-2 text-center'>REGULAR SIZES</th>
</tr>
<tr style={{verticalAlign:"middle"}}>
<th scope="col" className='py-1' rowSpan={2}>Brand Size</th>
<th scope="col" className='py-1' rowSpan={2}>Standard Size</th>
<th scope="col" className='py-1' colSpan={2}>Chest (in)</th>
</tr>
<tr>
<th scope="col" className='py-1'>Width (in)</th>
<th scope="col" className='py-1'>Length (in)</th>
</tr>
</>
: 
eventCategory?.slug === "mutthu-marathon-2025" ?
  <>
<tr>
  <th colSpan={5} className='py-2 text-center'>REGULAR SIZES</th>
</tr>
<tr style={{verticalAlign:"middle"}}>
<th scope="col" className='py-1'>Brand Size</th>
<th scope="col" className='py-1'>Standard Size</th>
<th scope="col" className='py-1'>Chest (in)</th>
<th scope="col" className='py-1'>Length (in)</th>
<th></th>
</tr>
</>
: 
<>
<tr>
    <th colSpan={5} className='py-2 text-center'>REGULAR SIZES</th>
  </tr>
<tr>
<th scope="col" className='py-1'>Brand Size</th>
<th scope="col" className='py-1'>Standard Size</th>
<th scope="col" className='py-1'>Chest (in)</th>
{eventCategory?.slug !== "senthil-marathon-2024" &&
<th scope="col" className='py-1'>Shoulder (in)</th>
}
<th scope="col" className='py-1'>Length (in)</th>
</tr>
</>
}
</thead>
}
<tbody>

    <>
<tr>
<td className='py-1'>XS</td>
<td className='py-1'>XS</td>
<td className='py-1'>36</td>
<td className='py-1'>16.3</td>
<td className='py-1'>25.5</td>
</tr>
<tr>
<td className='py-1'>S</td>
<td className='py-1'>S</td>
<td className='py-1'>38</td>
<td className='py-1'>16</td>
<td className='py-1'>27.8</td>
</tr>
<tr>
<td className='py-1'>M</td>
<td className='py-1'>M</td>
<td className='py-1'>40</td>
<td className='py-1'>16.8	</td>
<td className='py-1'>28.2</td>
</tr>
<tr>
<td className='py-1'>L</td>
<td className='py-1'>L</td>
<td className='py-1'>42	</td>
<td className='py-1'>17.5</td>
<td className='py-1'>	28.8</td>
</tr>
<tr>
<td className='py-1'>XL</td>
<td className='py-1'>XL</td>
<td className='py-1'>45	</td>
<td className='py-1'>18.2	</td>
<td className='py-1'>29.2</td>
</tr>
<tr>
<td className='py-1'>XXL</td>
<td className='py-1'>XXL</td>
<td className='py-1'>47.5</td>
<td className='py-1'>19</td>
<td className='py-1'>29.8</td>
</tr>
{eventCategory?.slug !== 'iiit-b-miles4meals-2026' &&
<tr>
<td className='py-1'>3XL</td>
<td className='py-1'>3XL</td>
<td className='py-1'>50</td>
<td className='py-1'>	19.8	</td>
<td className='py-1'>30.2</td>
</tr>

}
</>


{ eventCategory?.slug !== 'iiit-b-miles4meals-2026' && eventCategory?.slug !== 'kimshealth-marathon-2026' && eventCategory?.slug !== 'tumakuru-marathon-2026-2nd-edition' && eventCategory?.slug !== 'moonlight-track-run-2025' && eventCategory?.slug !== 'salem-runners-marathon-2024' && eventCategory?.slug !== 'perambalur-marathon' && eventCategory?.slug !== "ilaya-thalaivar-marathon-2024" && eventCategory?.slug !== 'nambi-odu-elampillai-run-3rd-edition' && eventCategory?.slug !== 'saree-run-2025' &&  (
<>
<tr>
    <th colSpan={5} className='py-2 text-center'>KIDS SIZES</th>
  </tr>
  {eventCategory?.slug !== "mutthu-marathon-2025" ? 
  <>
  {eventCategory?.slug !== "kids-marathon-2025" &&
  <>
  <tr>
<td className='py-1'>2-4 Yrs 24 inches</td>
<td className='py-1'>2-4 Yrs 24 inches</td>
<td className='py-1'></td>
<td className='py-1'></td>
<td className='py-1'></td>
</tr>
<tr>
<td className='py-1'>4-5 Yrs 26 inches</td>
<td className='py-1'>4-5 Yrs 26 inches</td>
<td className='py-1'></td>
<td className='py-1'></td>
<td className='py-1'></td>
</tr>
</>
}
<tr>
<td className='py-1'>5-7 Yrs 28 inches</td>
<td className='py-1'>5-7 Yrs 28 inches</td>
<td className='py-1'></td>
<td className='py-1'></td>
<td className='py-1'></td>
</tr>
<tr>
<td className='py-1'>7-8 Yrs 30 inches</td>
<td className='py-1'>7-8 Yrs 30 inches</td>
<td className='py-1'></td>
<td className='py-1'></td>
<td className='py-1'></td>
</tr>
<tr>
<td className='py-1'>8-10 Yrs 32 inches</td>
<td className='py-1'>8-10 Yrs 32 inches</td>
<td className='py-1'></td>
<td className='py-1'></td>
<td className='py-1'></td>
</tr>

</>
:
<>
  <tr>
<td className='py-1'>2-4 Yrs</td>
<td className='py-1'>2-4 Yrs</td>
<td className='py-1'>26</td>
<td className='py-1'>20</td>
<td className='py-1'></td>
</tr>
<tr>
<td className='py-1'>4-6 Yrs</td>
<td className='py-1'>4-6 Yrs</td>
<td className='py-1'>28</td>
<td className='py-1'>21</td>
<td className='py-1'></td>
</tr>
<tr>
<td className='py-1'>6-8 Yrs</td>
<td className='py-1'>6-8 Yrs</td>
<td className='py-1'>30</td>
<td className='py-1'>22</td>
<td className='py-1'></td>
</tr>
<tr>
<td className='py-1'>8-10 Yrs</td>
<td className='py-1'>8-10 Yrs</td>
<td className='py-1'>32</td>
<td className='py-1'>23</td>
<td className='py-1'></td>
</tr>
<tr>
<td className='py-1'>10-12 Yrs</td>
<td className='py-1'>10-12 Yrs</td>
<td className='py-1'>34</td>
<td className='py-1'>24</td>
<td className='py-1'></td>
</tr>
</>
}
</>)
}
</tbody>
</table>
</div>
}
  </Modal.Body>

</Modal>
</>
)}