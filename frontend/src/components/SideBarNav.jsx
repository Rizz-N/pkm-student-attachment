import { FaCog } from "react-icons/fa";
import { useState } from "react";
import { Link, useLocation, Routes, Route } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import AdminDash from "../pages/AdminDash";
import PanelGuru from "../pages/PanelGuru";
import PanelMurid from "../pages/PanelMurid";
import PanelKelas from "../pages/PanelKelas";

const SideBarNav = () => {
  const location = useLocation();

  const active = (path) => {
    return location.pathname === path
      ? "bg-white text-indigo-600"
      : "text-white/80 hover:bg-white/10 hover:text-white";
  };
  return (
    <>
      <div>
        <div className=" fixed left-0 top-0 h-screen p-6 flex flex-col bg-gradient-to-b from-blue-600 to-purple-600">
          <div className="flex items-center mb-10 text-white gap-4">
            <FaCog className="text-3xl" />
            <label className="text-xl">Admin Panel</label>
          </div>
          <div className="flex flex-col gap-8 text-white text-xl">
            <Link
              className={`p-2 rounded-xl text-center ${active("/admin")}`}
              to={"/admin"}
            >
              Dashboard
            </Link>
            <Link
              className={`p-2 rounded-xl text-center ${active(
                "/admin/panelguru"
              )}`}
              to={"/admin/panelguru"}
            >
              Data Guru
            </Link>
            <Link
              className={`p-2 rounded-xl text-center ${active(
                "/admin/panelmurid"
              )}`}
              to={"/admin/panelmurid"}
            >
              Data Murid
            </Link>
            <Link
              className={`p-2 rounded-xl text-center ${active(
                "/admin/panelkelas"
              )}`}
              to={"/admin/panelkelas"}
            >
              Data Kelas
            </Link>
          </div>
        </div>
        <div className="mt-20 ml-50">
          <Routes>
            <Route index element={<AdminDash />} />
            <Route path="panelguru" element={<PanelGuru />} />
            <Route path="panelmurid" element={<PanelMurid />} />
            <Route path="panelkelas" element={<PanelKelas />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default SideBarNav;
