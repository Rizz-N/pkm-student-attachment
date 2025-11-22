import { useState } from "react";
import { GoDownload } from "react-icons/go";
import Button from "../components/Button"
import SearchBar from "../components/SearchBar"
import Dropdown from "../components/Dropdown";

const TeacherAttendance = () => {
    const [fileName, setFileName] = useState("Surat Keterangan");

  return (
    <>
        <div className="m-10 bg-white rounded-xl p-5">
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <h1 className="text-2xl">Absensi Guru</h1>
                </div>
                <div className="flex justify-between items-center w-2/6">
                    <div className="relative">
                        <SearchBar placeholder="Cari Nama Guru"/>
                    </div>
                    <div className="relative">
                        <GoDownload className="absolute text-white text-2xl left-3 top-1/2 transform -translate-y-1/2" />
                        <Button name="Unduh" className="border-gray-300 text-white pl-10 pr-3 bg-blue-800 hover:bg-blue-900" />
                    </div>
                </div>
            </div>
            {/* tabel */}
            <div className="mt-10">
                <div className="mb-3">
                </div>
                <div className="flex gap-2 mb-4">
                    <Button name="Mark All Present" className="bg-blue-800 border-gray-400 text-white hover:bg-blue-900" />
                    <Button name="Mark All Absent" className="bg-blue-800 border-gray-400 text-white hover:bg-blue-900" />
                </div>

                <table className="table-auto w-full border-collapse text-center">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2">No</th>
                            <th className="px-3 py-2">NIG</th>
                            <th className="px-3 py-2">Nama</th>
                            <th className="px-3 py-2">Jenis Kelamin</th>
                            <th className="px-3 py-2">Wali Kelas</th>
                            <th className="px-3 py-2">Jam Masuk</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2">Keterangan</th>
                            <th className="px-3 py-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="border-b border-gray-300">
                            <td className="px-3 py-2">
                                <input type="checkbox" name="" id="" />
                            </td>
                            <td className="px-3 py-2">1</td>
                            <td className="px-3 py-2">2016</td>
                            <td className="px-3 py-2">Dina</td>
                            <td className="px-3 py-2">Perempuan</td>
                            <td className="px-3 py-2">12 MIPA 12</td>
                            <td className="px-3 py-2">07:00</td>
                            <td className="px-3 py-2">Hadir</td>
                            <td className="px-3 py-2">
                                <label className="border-1 py-2 px-3 rounded-2xl w-50 cursor-pointer">
                                    {fileName}
                                    <input  type="file" 
                                            name="file" 
                                            id="" 
                                            className="hidden"
                                            onChange={(e) => setFileName(e.target.files[0]?.name || "Surat Keterangan")} />
                                </label>
                            </td>
                            <td className="px-3 py-2">
                               <Dropdown />
                            </td>
                        </tr>
                    </tbody>
                </table>            
                <div className="flex justify-end p-2">
                    <Button name="Submit" className="bg-blue-800 border-gray-400 text-white hover:bg-blue-900" />
                </div>
            </div>
        </div>
    </>
  )
}

export default TeacherAttendance
