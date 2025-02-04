import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ClassList from "../../components/professorsComponent/ClassList";
import CreateClassForm from "../../components/professorsComponent/CreateClassForm";
import ClassDetailsPage from "../professorsPage/ClassDetailsPage";
import classData from "../../data/classes.json"; // Import the JSON file containing class data
import subjectsData from "../../data/subjects.json"; // Import the subjects data

const ClassManager = () => {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [visibleCount, setVisibleCount] = useState(6); // Controls how many classes are displayed
  const navigate = useNavigate();

  useEffect(() => {
    if (Array.isArray(classData.classes)) {
      setClasses(classData.classes); // Load the classes from the JSON file
    } else {
      console.error("classData is not an array", classData);
    }
  }, []);

  const handleCreateClass = (newClassName) => {
    if (!newClassName.trim()) {
      alert("Class name cannot be empty.");
      return;
    }
    const newClass = {
      id: classes.length + 1,
      classCode: newClassName, // Use classCode instead of name
      schedule: "TBD", // Default value for schedule
      students: [],
    };
    setClasses([...classes, newClass]);
    setNewClassName("");
    navigate("/class-details", { state: { classItem: newClass } });
  };

  const handleClassClick = (classItem) => {
    if (!classItem || !classItem.id) {
      alert("Invalid class selection.");
      return;
    }
    navigate("/class-details", { state: { classItem } });
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6); // Increase the number of visible classes by 6
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8">
      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg p-6 mt-8">
              <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Class Manager</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {classes.slice(0, visibleCount).map((classItem) => (
                  <div
                    key={classItem.id}
                    className="bg-blue-50 rounded-lg p-4 shadow hover:shadow-md cursor-pointer"
                    onClick={() => handleClassClick(classItem)}
                  >
                    <h3 className="text-lg font-medium text-blue-700">{classItem.classCode}</h3>
                    <p className="text-sm text-gray-600">Schedule: {classItem.schedule}</p>
                  </div>
                ))}
              </div>
              {visibleCount < classes.length && (
                <button
                  onClick={handleShowMore}
                  className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Show More
                </button>
              )}
              <CreateClassForm
                newClassName={newClassName}
                setNewClassName={setNewClassName}
                onCreateClass={handleCreateClass}
              />
            </div>
          }
        />
        <Route path="/class-details" element={<ClassDetailsPage />} />
      </Routes>
    </div>
  );
};

export default ClassManager;
