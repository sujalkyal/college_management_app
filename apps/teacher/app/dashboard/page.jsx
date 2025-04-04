"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import EditTeacherPopup from '../../components/Popup';

const SubjectDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [dept, setDept] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

    const fetchTeacherDetails = async () => {
        try {
          const teacherRes = await axios.get('/api/teacher/getTeacherDetails', {
            withCredentials: true
          });

          setTeacher(teacherRes.data.user);
          setSubjects(teacherRes.data.subjects);
          setDept(teacherRes.data.dept_name);

          console.log(subjects);

        } catch (error) {
          console.error('Error fetching data:', error.response?.data?.message || error.message);
        }
      };


  const fetchUpcomingSessions = async () => {
    try {
      const sessionRes = await axios.get('/api/teacher/upcomingSession', {
        withCredentials: true
      });
      setUpcomingSessions(sessionRes.data.filteredSessions);
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    fetchUpcomingSessions();
    fetchTeacherDetails();
  }, []);


  const handleEditClick = () => {
    setIsPopupOpen(true);
  };
  
  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-pink-50 to-indigo-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Two-Column Layout for Profile and Classes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Teacher Profile Card */}
          {teacher && (
            <div className="bg-white rounded-lg shadow-lg p-6 w-full">
              <div className="flex flex-col items-center lg:items-start lg:flex-row">
                <div className="w-24 h-24 mb-4 lg:mb-0 lg:mr-6">
                  <img 
                    src={teacher.profilePic || "/api/placeholder/96/96"} 
                    alt="Teacher" 
                    className="w-full h-full rounded-full object-cover border-2 border-indigo-500"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl font-bold text-indigo-800">{teacher.name}</h2>
                  <p className="text-gray-600">Email: {teacher.email}</p>
                  <p className="text-gray-600">Department: {dept}</p>
                   <button onClick={handleEditClick} className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600">Edit Details</button>

                  <div className="mt-4 space-y-2">
                    {subjects.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg shadow-sm w-full space-x-6">
                        <h3 className="font-medium text-gray-800">{subject.name}</h3>
                        <p className="text-gray-500 text-sm">Batch: {subject.batch_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scheduled Classes Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 w-full">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">Scheduled Classes</h2>
            <div className="space-y-4">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session, index) => (
                  <div 
                    key={index} 
                    className="border-b pb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg" 
                    onClick={() => router.push(`/dashboard/subject/session/${session.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{session.subject_name}</h3>
                        <p className="text-gray-500 text-sm">Subject: {session.subject_id}</p>
                        <p className="text-gray-500 text-sm">Date: {new Date(session.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No upcoming sessions scheduled.</p>
              )}
            </div>
          </div>

          {/* Subject Selection Section */}
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-indigo-800 mb-6">Select Subject</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-indigo-100 transition cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => router.push(`/dashboard/subject/${subject.id}`)}
              >
                <div className="w-16 h-16 mb-3 flex items-center justify-center bg-indigo-50 rounded-full">
                  <h3 className="font-medium text-gray-900">{subject.name}</h3>
                </div>
                <h2 className="font-normal text-gray-700">{subject.batch_name}</h2>
              </div>
            ))}
          </div>
        </div>

        {isPopupOpen && (
          <EditTeacherPopup
            teacher={teacher}
            isOpen={true}
            onClose={() => setIsPopupOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SubjectDashboard;
