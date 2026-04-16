import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Dropdown, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import CustomNavbar from "../shared/Navbar";
import CardComponent from "./cardComponent";

const SkillProfileView = () => {
  const locationHook = useLocation();
  const navigate = useNavigate();

  const { searchType, searchTerm, profiles } = locationHook.state || {};

  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [showNoProfilesModal, setShowNoProfilesModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (profiles) {
      filterProfiles(searchTerm, searchType);
    }
  }, [searchType, searchTerm, profiles]);

  const filterProfiles = (term, type) => {
    if (!profiles || !Array.isArray(profiles)) {
      setFilteredProfiles([]);
      return;
    }

    let filtered;

    if (type === "skill") {
  filtered = profiles.filter((profile) =>
    profile.skills?.includes(term)
  );
} else {
  filtered = profiles.filter((profile) =>
    profile.state?.toLowerCase() === term.toLowerCase()
  );
}

    setFilteredProfiles(filtered);

    if (filtered.length === 0) {
      setShowNoProfilesModal(true);
    } else {
      updateFilterOptions(filtered, type);
    }
  };

  const updateFilterOptions = (profiles, type) => {
    let options;

    if (type === "skill") {
      // ✅ FIXED: use location
      options = [...new Set(profiles.map((p) => p.state))];
    } else {
      options = [
        ...new Set(
          profiles.flatMap((p) => p.skills || [])
        ),
      ];
    }

    setFilterOptions(options);
  };

  const handleFilter = (option) => {
    if (searchType === "skill") {
      setFilteredProfiles(
        profiles.filter(
          (p) =>
            p.state === option &&
            p.skills?.includes(searchTerm)
        )
      );
    } else {
      setFilteredProfiles(
        profiles.filter(
          (p) =>
            p.location?.includes(searchTerm) &&
            p.skills?.includes(option)
        )
      );
    }
  };

  const handleSearchAgain = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <CustomNavbar />

      <Container className="mt-5">
        <h2 className="text-center mb-4">
          Public Profiles -{" "}
          {searchType === "skill"
            ? `Skill: ${searchTerm}`
            : `Location: ${searchTerm}`}
        </h2>

        <div className="d-flex justify-content-center mb-4">
          <Dropdown>
            <Dropdown.Toggle
              style={{
                backgroundColor: "#6A38C2",
                border: "none",
                borderRadius: "25px",
              }}
            >
              {searchType === "skill"
                ? "Filter by Location"
                : "Filter by Skill"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {filterOptions.map((option, index) => (
                <Dropdown.Item key={index} onClick={() => handleFilter(option)}>
                  {option}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Row>
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <Col md={6} lg={4} key={profile.id}>
                <CardComponent profile={profile} />
              </Col>
            ))
          ) : (
            <p className="text-center">No profiles available.</p>
          )}
        </Row>

        <div className="text-center mt-4">
          <Button
            onClick={handleSearchAgain}
            style={{
              backgroundColor: "#6A38C2",
              borderRadius: "25px",
            }}
          >
            Search Again
          </Button>
        </div>
      </Container>

      <Modal
        show={showNoProfilesModal}
        onHide={() => setShowNoProfilesModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>No Users Found</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          No users found with the selected criteria.
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowNoProfilesModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SkillProfileView;