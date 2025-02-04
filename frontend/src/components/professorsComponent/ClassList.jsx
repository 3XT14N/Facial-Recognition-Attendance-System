import React, { useEffect, useState } from "react";

const ClassList = ({ classes, subjectsData, onClassClick }) => {
  const [filteredClasses, setFilteredClasses] = useState([]);

  useEffect(() => {
    console.log(classes); // Check the classes data
    console.log(subjectsData); // Check the subjects data

    if (Array.isArray(classes) && Array.isArray(subjectsData)) {
      // Safely map subjects to classes using the subjectId and id
      const updatedClasses = classes.map((classItem) => {
        // Find the subject from the subjectsData array using subjectId
        const subject = subjectsData.find(
          (subject) => subject.id === classItem.subjectId
        );

        // If subject is found, map the name, otherwise set to a default message
        return {
          ...classItem,
          subject: subject ? subject.name : "No subject available",
        };
      });

      setFilteredClasses(updatedClasses);
    } else {
      console.error("Either classes or subjectsData is not an array");
    }
  }, [classes, subjectsData]);

  if (!filteredClasses || filteredClasses.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No classes available.</p>;
  }

  return (
    <div className="class-list p-4 bg-gray-50 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Available Classes</h3>
      <ul className="space-y-4">
        {filteredClasses.map((classItem) => (
          <li
            key={classItem.id}
            className="class-item cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-200 rounded-lg p-4 border-2 border-transparent hover:border-blue-500"
            onClick={() => onClassClick(classItem)}
          >
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">{classItem.classCode}</span>
              <span className="text-sm text-gray-600">{classItem.professor}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Subject:</span> {classItem.subject || "No subject name available"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassList;
