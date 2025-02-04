import React, { useState } from "react";

const StudentList = ({ students, onStudentClick }) => {
  const [showAll, setShowAll] = useState(false); // State to control visibility of all students
  const displayedStudents = showAll ? students : students.slice(0, 6); // Show all or only the first six students

  const handleToggleShowMore = () => {
    setShowAll(!showAll); // Toggle between showing all and only the initial set
  };

  return (
    <div className="mb-6 max-h-96 overflow-y-auto">
      <h4 className="text-lg font-semibold mb-4">Students:</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedStudents.map((student, index) => (
          <div
            key={index}
            className="bg-blue-100 p-4 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 cursor-pointer"
            onClick={() => onStudentClick(student)}
          >
            <h5 className="font-semibold text-lg text-blue-800">{student.name}</h5>
            <p className="text-sm text-gray-600">Student #{index + 1}</p>
          </div>
        ))}
      </div>
      {students.length > 6 && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          onClick={handleToggleShowMore}
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default StudentList;
