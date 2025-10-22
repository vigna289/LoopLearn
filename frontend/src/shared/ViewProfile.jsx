import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../shared/Navbar";
import { Button, FormControl, InputGroup, Form } from "react-bootstrap";

const skillsOptions = [
  "Accountant", "Software Developer", "Graphic Designer", "Architect", "Social Worker",
  "Dentist", "Real Estate Agent", "Electrician", "Plumber", "Carpenter",
  "Mechanic", "Chef", "Nurse", "Teacher", "Hairdresser", "Gardener",
  "Housekeeper/Maid", "Barista", "Painter", "Truck Driver", "Civil Engineer",
  "Lawyer", "Psychologist", "Veterinarian", "Fashion Designer", "IT Support Specialist",
  "Fitness Trainer", "Translator", "Event Planner", "Interior Designer",
];

const statesOptions = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha",
  "Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu","Lakshadweep","Delhi","Puducherry",
];

const qualificationsOptions = [
  "Bachelor of Engineering (BE)","Bachelor of Technology (BTech)","Master of Engineering (ME)",
  "Master of Technology (MTech)","Bachelor of Science (BSc)","Master of Science (MSc)",
  "Bachelor of Arts (BA)","Master of Arts (MA)","Bachelor of Commerce (BCom)","Master of Commerce (MCom)",
  "Bachelor of Business Administration (BBA)","Master of Business Administration (MBA)","Bachelor of Computer Applications (BCA)",
  "Master of Computer Applications (MCA)","Bachelor of Education (BEd)","Master of Education (MEd)","Bachelor of Fine Arts (BFA)",
  "Master of Fine Arts (MFA)","Bachelor of Law (LLB)","Master of Law (LLM)","Bachelor of Pharmacy (BPharm)",
  "Master of Pharmacy (MPharm)","Bachelor of Architecture (BArch)","Master of Architecture (MArch)",
  "Bachelor of Dental Surgery (BDS)","Master of Dental Surgery (MDS)","Bachelor of Medicine, Bachelor of Surgery (MBBS)",
  "Doctor of Medicine (MD)","Master of Surgery (MS)","Doctor of Philosophy (PhD)","Master of Philosophy (MPhil)",
  "Bachelor of Social Work (BSW)","Master of Social Work (MSW)","Bachelor of Design (BDes)","Master of Design (MDes)",
  "Bachelor of Hotel Management (BHM)","Master of Hotel Management (MHM)","Bachelor of Physical Education (BPEd)",
  "Master of Physical Education (MPEd)","Bachelor of Veterinary Science (BVSc)","Master of Veterinary Science (MVSc)",
  "Bachelor of Audiology and Speech-Language Pathology (BASLP)","Master of Audiology and Speech-Language Pathology (MASLP)",
  "Bachelor of Physiotherapy (BPT)","Master of Physiotherapy (MPT)",
];

const ViewProfile = () => {
  const [user, setUser] = useState(null);
  const [editableField, setEditableField] = useState(null);
  const [updatedValue, setUpdatedValue] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userData = JSON.parse(localStorage.getItem("userProfile"));
      if (!userData) {
        navigate("/login");
        return;
      }

      // Map localStorage data to proper select values
      const mappedUser = {
        ...userData,
        state: userData.state ? { value: userData.state, label: userData.state } : null,
        qualification: userData.qualification
          ? { value: userData.qualification, label: userData.qualification }
          : null,
        skills: userData.skills ? userData.skills.map((s) => ({ value: s, label: s })) : [],
        desired_skills: userData.desired_skills
          ? userData.desired_skills.map((s) => ({ value: s, label: s }))
          : [],
      };

      setUser(mappedUser);
    };

    fetchUserProfile();
  }, [navigate]);

  const handleEdit = (field) => {
    setEditableField(field);

    // Prefill edit value correctly
    if (field === "skills" || field === "desired_skills") {
      setUpdatedValue(user[field].length > 0 ? user[field][0].value : "");
    } else if (field === "state" || field === "qualification") {
      setUpdatedValue(user[field] ? user[field].value : "");
    } else {
      setUpdatedValue(user[field] || "");
    }
  };

  const handleUpdate = async () => {
    try {
      let payload = {};
      if (editableField === "skills" || editableField === "desired_skills") {
        payload[editableField] = [updatedValue]; // array of strings
      } else {
        payload[editableField] = updatedValue;
      }

      // Update local user state
      const updatedUser = { ...user };
      if (editableField === "skills" || editableField === "desired_skills") {
        updatedUser[editableField] = [{ value: updatedValue, label: updatedValue }];
      } else if (editableField === "state" || editableField === "qualification") {
        updatedUser[editableField] = { value: updatedValue, label: updatedValue };
      } else {
        updatedUser[editableField] = updatedValue;
      }

      setUser(updatedUser);
      setEditableField(null);

      // Update API if needed
      // await axios.patch(`${API_URL}/api/users/${user.id}/`, payload);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  const fieldsToDisplay = {
    full_name: "Full Name",
    email: "Email",
    phone_number: "Phone Number",
    city: "City",
    state: "State",
    qualification: "Qualification",
    year_of_experience: "Years of Experience",
    skills: "Skills",
    certification1: "Certification 1",
    certification2: "Certification 2",
    desired_skills: "Desired Skills",
  };

  return (
    <>
      <CustomNavbar />
      <div className="container mt-5">
        <h2>Profile Details</h2>
        <table className="table">
          <tbody>
            {Object.keys(fieldsToDisplay).map((key) => (
              <tr key={key}>
                <th>{fieldsToDisplay[key]}</th>
                <td>
                  {editableField === key ? (
                    key === "skills" || key === "desired_skills" ? (
                      <Form.Group>
                        <Form.Control
                          as="select"
                          value={updatedValue}
                          onChange={(e) => setUpdatedValue(e.target.value)}
                        >
                          <option value="">Select a skill</option>
                          {skillsOptions.map((s, i) => (
                            <option key={i} value={s}>
                              {s}
                            </option>
                          ))}
                        </Form.Control>
                        <Button onClick={handleUpdate}>Update</Button>
                      </Form.Group>
                    ) : key === "state" ? (
                      <Form.Group>
                        <Form.Control
                          as="select"
                          value={updatedValue}
                          onChange={(e) => setUpdatedValue(e.target.value)}
                        >
                          <option value="">Select a state</option>
                          {statesOptions.map((s, i) => (
                            <option key={i} value={s}>
                              {s}
                            </option>
                          ))}
                        </Form.Control>
                        <Button onClick={handleUpdate}>Update</Button>
                      </Form.Group>
                    ) : key === "qualification" ? (
                      <Form.Group>
                        <Form.Control
                          as="select"
                          value={updatedValue}
                          onChange={(e) => setUpdatedValue(e.target.value)}
                        >
                          <option value="">Select a qualification</option>
                          {qualificationsOptions.map((q, i) => (
                            <option key={i} value={q}>
                              {q}
                            </option>
                          ))}
                        </Form.Control>
                        <Button onClick={handleUpdate}>Update</Button>
                      </Form.Group>
                    ) : (
                      <InputGroup>
                        <FormControl
                          value={updatedValue}
                          onChange={(e) => setUpdatedValue(e.target.value)}
                        />
                        <Button onClick={handleUpdate}>Update</Button>
                      </InputGroup>
                    )
                  ) : key === "skills" || key === "desired_skills" ? (
                    user[key].map((s) => s.value).join(", ")
                  ) : key === "state" || key === "qualification" ? (
                    user[key] ? user[key].value : "N/A"
                  ) : (
                    user[key] || "N/A"
                  )}
                </td>
                <td>
                  {editableField !== key && (
                    <Button onClick={() => handleEdit(key)}>Edit</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ViewProfile;
