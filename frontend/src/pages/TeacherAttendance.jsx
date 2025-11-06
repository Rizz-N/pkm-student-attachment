import { useState } from "react";
import { GoDownload } from "react-icons/go";
import Button from "../components/Button"
import SearchBar from "../components/SearchBar"

const TeacherAttendance = () => {
  return (
    <>
        <div className="m-10 bg-white rounded-xl p-5">
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <h1 className="text-2xl">Absensi Guru</h1>
                </div>
                <div className="flex justify-between items-center w-2/6">
                    <div className="relative">
                        <SearchBar placeholder="Cari Siswa"/>
                    </div>
                    <div className="relative">
                        <GoDownload className="absolute text-2xl left-3 top-1/2 transform -translate-y-1/2" />
                        <Button name="Unduh" className="border-gray-300 pl-10 pr-3 bg-yellow-300 hover:bg-yellow-400" />
                    </div>
                </div>
            </div>
            {/* tabel */}
            <div className="mt-10">
                <div className="mb-3">
                </div>
                <div className="flex gap-2 mb-4">
                    <Button name="Mark All Present" className="bg-yellow-300 border-gray-400 hover:bg-yellow-400" />
                    <Button name="Mark All Absent" className="bg-yellow-300 border-gray-400 hover:bg-yellow-400" />
                </div>

                <table className="table-auto w-full border-collapse text-center">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-3 py-2">No</th>
                            <th className="px-3 py-2">NIG</th>
                            <th className="px-3 py-2">Nama</th>
                            <th className="px-3 py-2">Jenis Kelamin</th>
                            <th className="px-3 py-2">Wali Kelas</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="border-b border-gray-300">
                            <td className="px-3 py-2">1</td>
                            <td className="px-3 py-2">2016</td>
                            <td className="px-3 py-2">Dina</td>
                            <td className="px-3 py-2">Perempuan</td>
                            <td className="px-3 py-2">12 MIPA 12</td>
                            <td className="px-3 py-2">Hadir</td>
                            <td className="px-3 py-2">
                                <div className="flex justify-end gap-x-2">
                                <Button
                                    name="Present"
                                    className="bg-green-300 border border-gray-400 hover:bg-green-400 px-3 py-1 rounded-md"
                                />
                                <Button
                                    name="Absent"
                                    className="bg-red-300 border border-gray-400 hover:bg-red-400 px-3 py-1 rounded-md"
                                />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>            
                <div className="flex justify-end p-2">
                    <Button name="Submit" className="bg-yellow-300 border-gray-400 hover:bg-yellow-400" />
                </div>
            </div>
        </div>
    </>
  )
}

export default TeacherAttendance
