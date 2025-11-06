import {Routes, Route, Link, useLocation } from "react-router-dom"
import Button from "../components/Button"
import Overview from "./Overview"
import StudentAttendance from "./StudentAttendance"
import TeacherAttendance from "./TeacherAttendance"

const Dashboard = () => {
    const location = useLocation();

    const active = (path) =>
        location.pathname === path
        ? "bg-yellow-500 text-white"
        : "hover:bg-yellow-400 hover:text-white";

    return (
    <>
    <div className="p-3 flex justify-between items-center bg-white shadow-sm fixed w-screen top-0">
        <div className="flex items-center gap-10">
            <div>
                <img src="https://via.assets.so/img.jpg?w=60&h=60&shape=circle&bg=e5e7eb&f=png" alt="profile" className="border border-gray-400 rounded-full" />
            </div>
            <div>
                <h1 className="text-2xl" >Attendance Management</h1>
                <p>welcome : </p>
            </div>
        </div>
        <Button name={'Logout'} className="border-gray-400 bg-yellow-300 hover:bg-yellow-400" />
    </div>
    <div className="flex justify-between rounded-full w-1/2 p-3 m-10 bg-blue-800 mt-30">
        <Link to="/dashboard" className={` text-2xl text-white border-gray-700 px-2 py-1 rounded-full ${active("/dashboard")}`}>Overview</Link>
        <Link to="/dashboard/student" className={` text-2xl text-white border-gray-700 px-2 py-1 rounded-full ${active("/dashboard/student")}`} >Student Attendance</Link>
        <Link to="/dashboard/teacher" className={` text-2xl text-white border-gray-700 px-2 py-1 rounded-full ${active("/dashboard/teacher")}`} >Teacher Attendance</Link>
    </div>
    <div>
        <Routes>
          <Route index element={<Overview />} />
          <Route path="student" element={<StudentAttendance />} />
          <Route path="teacher" element={<TeacherAttendance />} />
        </Routes>
    </div>
  </>
  )
}

export default Dashboard
