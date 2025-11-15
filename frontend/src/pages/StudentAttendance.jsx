import { useState } from "react";
import { GoDownload } from "react-icons/go";
import Button from "../components/Button"
import SearchBar from "../components/SearchBar"

const StudentAttendance = () => {
    const [kelas, setKelas] = useState("");

  return (
    <>
        <div className="m-10 bg-white rounded-xl p-5">
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <h1 className="text-2xl">Absensi Siswa</h1>
                </div>
                <div className="flex justify-between items-center w-2/6">
                    <div className="relative">
                        <SearchBar placeholder="Cari Siswa"/>
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
                    <div className="w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pilih Kelas
                        </label>
                        <select
                            value={kelas}
                            onChange={(e) => setKelas(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">-- Pilih Kelas --</option>
                            <option value="10">Kelas 10</option>
                            <option value="11">Kelas 11</option>
                            <option value="12">Kelas 12</option>
                        </select>

                        {kelas && (
                            <p className="mt-3 text-sm text-gray-600">
                            Kamu memilih: <span className="font-semibold">{kelas}</span>
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 mb-4">
                    <Button name="Mark All Present" className="bg-blue-800 border-gray-300 text-white hover:bg-blue-900" />
                    <Button name="Mark All Absent" className="bg-blue-800 border-gray-300 text-white hover:bg-blue-900" />
                </div>

                <table className="table-auto w-full border-collapse text-center">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-3 py-2" >NO</th>
                            <th className="px-3 py-2" >NIS</th>
                            <th className="px-3 py-2" >Nama Lengkap</th>
                            <th className="px-3 py-2" >Jenis Kelamin</th>
                            <th className="px-3 py-2" >Status</th>
                            <th className="px-3 py-2" >Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="border-b border-gray-300">
                            <td className="px-3 py-2" >1</td>
                            <td className="px-3 py-2" >nis</td>
                            <td className="px-3 py-2" >nama</td>
                            <td className="px-3 py-2" >kel</td>
                            <td className="px-3 py-2" >ambil status</td>
                            <td className="px-3 py-2">
                                <select name="" id="">
                                    <option value="Hadir">Hadir</option>
                                    <option value="Sakit">Sakit</option>
                                    <option value="Izin">Izin</option>
                                    <option value="Tidak Hadir">Tidak Hadir</option>
                                </select>
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

export default StudentAttendance
