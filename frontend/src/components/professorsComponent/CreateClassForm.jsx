import React, { useState } from "react";

const CreateClassForm = ({ onCreateClass }) => {
  const [newClassName, setNewClassName] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [subjectSuggestions, setSubjectSuggestions] = useState([]);

  // Map subjects for each year level
  const subjects = {
    "DIT 1": ["Math 101", "History 101"],
    "DIT 2": ["Biology 102", "Chemistry 103"],
    "DIT 3": ["Physics 104", "Computer Science 105"],
    "BSIT 1": ["Programming 101", "Data Structures"],
    "BSIT 2": ["Database Management", "Web Development"],
    "BSIT 3": ["Operating Systems", "Software Engineering"],
    "BSIT 4": ["Cloud Computing", "AI and Machine Learning"],
  };

  // Update the subject suggestions based on the selected year level
  const handleYearLevelChange = (e) => {
    const yearLevel = e.target.value;
    setSelectedYearLevel(yearLevel);
    setSelectedSection("");
    setNewClassName("");
    setSubjectSuggestions(yearLevel ? subjects[yearLevel] : []);
  };

  const handleSubjectChange = (e) => {
    setNewClassName(e.target.value);
  };

  const handleSubmit = () => {
    if (newClassName && selectedYearLevel && selectedSection) {
      // Call the onCreateClass function with all the required fields
      onCreateClass({
        name: newClassName,
        yearLevel: selectedYearLevel,
        section: selectedSection,
      });
      // Clear the form fields
      setNewClassName("");
      setSelectedYearLevel("");
      setSelectedSection("");
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <div className="mt-6 mb-4">
      {/* Year Level Dropdown (DIT/BSIT courses) */}
      <select
        value={selectedYearLevel}
        onChange={handleYearLevelChange}
        className="w-full p-2 border rounded-md mb-4"
      >
        <option value="">Select Year Level</option>
        <option value="DIT 1">DIT 1</option>
        <option value="DIT 2">DIT 2</option>
        <option value="DIT 3">DIT 3</option>
        <option value="BSIT 1">BSIT 1</option>
        <option value="BSIT 2">BSIT 2</option>
        <option value="BSIT 3">BSIT 3</option>
        <option value="BSIT 4">BSIT 4</option>
      </select>

      {/* Section Dropdown */}
      <select
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      >
        <option value="">Select Section</option>
        <option value="A">Section A</option>
        <option value="B">Section B</option>
        <option value="C">Section C</option>
        <option value="D">Section D</option>
      </select>

      {/* Typeable Subject Input */}
      <div>
        <input
          type="text"
          value={newClassName}
          onChange={handleSubjectChange}
          placeholder="Type subject name"
          className="w-full p-2 border rounded-md mb-4"
        />
        {selectedYearLevel && subjectSuggestions.length > 0 && (
          <ul className="mt-2 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
            {subjectSuggestions
              .filter((subject) =>
                subject.toLowerCase().includes(newClassName.toLowerCase())
              )
              .map((filteredSubject, index) => (
                <li
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => setNewClassName(filteredSubject)}
                >
                  {filteredSubject}
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Create Class Button */}
      <button
        onClick={handleSubmit}
        className="mt-2 w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300"
      >
        Create Class
      </button>
    </div>
  );
};

export default CreateClassForm;
