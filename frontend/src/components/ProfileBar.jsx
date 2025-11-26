import { useState } from "react";
import { GoSidebarCollapse } from "react-icons/go";
const ProfileBar = ({isOpen, setIsOpen}) => {

  return (
    <>
        <div className={`
        fixed border-r-4 border-blue-800 bg-white h-screen w-2/7 z-[1000]
        top-0 left-0
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
            <div className="bg-white h-1/9 mt-6 mx-2 rounded-xl relative border-2 border-gray-400 ">
                <div className="absolute left-7 top-9 border-3 border-sky-400 rounded-full ">
                    <img src="https://via.assets.so/img.jpg?w=90&h=90&shape=circle&bg=e5e7eb&f=png" alt="image" />
                </div>
                <button
                    onClick={() => setIsOpen(false)} 
                    className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer shadow-lg hover:bg-gray-200 p-2 rounded-xl" >
                    <GoSidebarCollapse className="text-4xl " />
                </button>
            </div>
            <div className="flex flex-col py-5 gap-4 px-8 bg-white h-7/10 mt-20 mx-2 rounded-xl">
                <div className="border-b-2 border-gray-300">
                    <label className="text-gray-500 text-sm"> NIP</label>
                    <h1 className="pl-3 text-xl">024828401</h1>
                </div>
                <div className="border-b-2 border-gray-300">
                    <label className="text-gray-500 text-sm"> Name</label>
                    <h1 className="pl-3 text-xl">Name</h1>
                </div>
                <div className="border-b-2 border-gray-300">
                    <label className="text-gray-500 text-sm"> Jenis Kelamin</label>
                    <h1 className="pl-3 text-xl">Laki laki</h1>
                </div>
                <div className="border-b-2 border-gray-300">
                    <label className="text-gray-500 text-sm"> Mata pelajaran</label>
                    <h1 className="pl-3 text-xl">B.Indonesia</h1>
                </div>
                <div className="border-b-2 border-gray-300">
                    <label className="text-gray-500 text-sm">Jabatan</label>
                    <h1 className="pl-3 text-xl">Wali kelas</h1>
                </div>
                <div className="border-b-2 border-gray-300">
                    <label className="text-gray-500 text-sm">Alamat</label>
                    <h1 className="pl-3 text-xl">Jakarta</h1>
                </div>
            </div>
        </div>
    </>
  )
}

export default ProfileBar
