import {Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import axiosToken, { setAuthToken } from "../utils/axiosToken";
import { GoSignOut } from "react-icons/go";
import Overview from "./Overview"
import StudentAttendance from "./StudentAttendance"
import TeacherAttendance from "./TeacherAttendance"
import { getTotal } from "../services/getTotal";

const Dashboard = () => {
    const location = useLocation();
    const [name, setName] =  useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        const init = async () => {
            refreshToken();
            getUser();
        }
        init();
    },[]);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token',{
                withCredentials: true
            });
            const token = response.data[0].payload.accessToken;
            setAuthToken(token);
            getUser();
        } catch (error) {
            if(error.response){
                navigate("/login");
            }
        }
    }



    const getUser = async () => {
        try {
            const response = await axiosToken.get('http://localhost:5000/users');
            setName(response.data[0]?.payload.guru.nama_lengkap);
        } catch (error) {
            console.log(error);
        }
    }

    const logout = async () => {
        try {
            await axios.delete('http://localhost:5000/logout',{
                withCredentials: true
            });
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    }


    const active = (path) =>
        location.pathname === path
        ? "bg-yellow-500 text-white"
        : "hover:bg-yellow-400 hover:text-white";

    return (
    <>
    <div className="py-3 px-15 flex justify-between items-center bg-white shadow-sm fixed w-screen top-0 z-1000">
        <div className="flex items-center gap-10">
            <div>
                <img src="https://via.assets.so/img.jpg?w=60&h=60&shape=circle&bg=e5e7eb&f=png" alt="profile" className="border border-gray-400 rounded-full" />
            </div>
            <div>
                <h1 className="text-2xl" >Attendance Management</h1>
                <p>welcome : {name} </p>
            </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
            <GoSignOut  className=" text-lg"/>
            Logout
        </button>
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
