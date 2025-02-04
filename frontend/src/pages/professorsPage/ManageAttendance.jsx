import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import classesData from "../../data/classes.json";
import attendanceData from "../../data/attendance.json";
import studentsData from "../../defaultAccounts.json";

// Set the root element for react-modal for accessibility
Modal.setAppElement("#root");

const ManageAttendance = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    // Fetch classes and students (if needed)
  }, []);

  const handleClassSelection = (classId) => {
    const selected = classesData.classes.find((classItem) => classItem.id === classId);
    setSelectedClass(selected);

    // Set students list for the selected class
    const studentsInClass = studentsData.accounts.filter((student) =>
      selected.students.includes(student.id)
    );
    setClassStudents(studentsInClass);

    // Fetch attendance records for the selected class
    const attendanceForClass = attendanceData.attendance.filter(
      (att) => att.classId === classId
    );
    setAttendanceRecords(attendanceForClass);
    setModalIsOpen(true);
  };

  const handleAttendanceChange = (studentId, newStatus) => {
    // Update the attendance status for the selected student
    const updatedAttendance = attendanceRecords.map((record) => {
      if (record.date === selectedDate) {
        record.records = record.records.map((entry) =>
          entry.studentId === studentId ? { ...entry, status: newStatus } : entry
        );
      }
      return record;
    });

    // Update the state with the modified attendance records
    setAttendanceRecords(updatedAttendance);

    // You can add a function to persist this change in the backend or local storage.
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8">
      <h2 className="text-3xl font-semibold text-blue-600 mb-6">Manage Attendance</h2>

      {/* List of classes to select from */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Select a Class:</h3>
        <ul className="list-disc pl-5">
          {classesData.classes.map((classItem) => (
            <li
              key={classItem.id}
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => handleClassSelection(classItem.id)}
            >
              {classItem.classCode} - {classItem.schedule}
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for managing attendance */}
      {modalIsOpen && selectedClass && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className="bg-white max-w-2xl mx-auto my-10 p-6 rounded-lg shadow-lg"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="relative">
            <button
              onClick={() => setModalIsOpen(false)}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
            >
              Close
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-4">
            Manage Attendance for {selectedClass.classCode} - {selectedClass.schedule}
          </h2>

          {/* Date selection */}
          <div className="mb-4">
            <label htmlFor="attendanceDate" className="text-lg font-medium">
              Select Date:
            </label>
            <input
              type="date"
              id="attendanceDate"
              value={selectedDate}
              onChange={handleDateChange}
              className="border px-4 py-2 mt-2 w-full rounded-md"
            />
          </div>

          {/* Attendance Records for Students */}
          {selectedDate && classStudents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Students' Attendance</h3>
              <table className="table-auto w-full border-collapse border border-gray-400">
                <thead>
                  <tr>
                    <th className="border border-gray-400 px-4 py-2">Student Name</th>
                    <th className="border border-gray-400 px-4 py-2">Status</th>
                    <th className="border border-gray-400 px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((student) => {
                    const attendanceRecord = attendanceRecords
                      .find((record) => record.date === selectedDate)
                      ?.records.find((entry) => entry.studentId === student.id);

                    return (
                      <tr key={student.id}>
                        <td className="border border-gray-400 px-4 py-2">{student.name}</td>
                        <td className="border border-gray-400 px-4 py-2">
                          {attendanceRecord ? attendanceRecord.status : "No Record"}
                        </td>
                        <td className="border border-gray-400 px-4 py-2">
                          <button
                            onClick={() => handleAttendanceChange(student.id, "present")}
                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                          >
                            Mark Present
                          </button>
                          <button
                            onClick={() => handleAttendanceChange(student.id, "absent")}
                            className="ml-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                          >
                            Mark Absent
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default ManageAttendance;
