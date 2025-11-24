import { useState, useEffect } from "react";
import { useAbsensiGuru } from "../hooks/useAbsensiGuru";
import { GoDownload } from "react-icons/go";
import Button from "../components/Button"
import SearchBar from "../components/SearchBar"
import { absensiGuru } from "../services/absensiGuru";
import Dropdown from "../components/Dropdown";
import StatusBadge from "../components/StatusBadge";

const TeacherAttendance = () => {
    const {
        guruList,
        absensiToday,
        selectedGuru,
        setSelectedGuru,
        loading,
        error,
        submitResult,
        updateGuruStatus,
        updateGuruKeterangan,
        updateGuruFile,
        markSelectedPresent,
        markSelectedAbsent,
        submitAbsensi,
        clearSubmitResult,
        refetchGuru
    } = useAbsensiGuru();

    const [searchTerm, setSearchTerm] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState ('');

    const filteredGuru = guruList.filter(guru =>
        guru.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guru.nip?.includes(searchTerm)
    );

     // Handle select checkbox
    const handleSelectGuru = (guru_id) => {
        setSelectedGuru(prev =>
            prev.includes(guru_id)
                ? prev.filter(id => id !== guru_id)
                : [...prev, guru_id]
        );
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectedGuru.length === filteredGuru.length) {
            setSelectedGuru([]);
        } else {
            setSelectedGuru(filteredGuru.map(guru => guru.guru_id));
        }
    };

    // Show absensi result
    const showAbsensiResult = (result) => {
        if(result && result [0]){
            const {payload, message} = result[0];

            let successMessage = message;
            let detailMessage = '';

            if(payload){
                const{guru, berhasil, sudah_absen} = payload;

                if(berhasil && berhasil.length > 0){
                    detailMessage += `berhasil absen ${berhasil.length} guru\n`

                    if(sudah_absen && sudah_absen.length > 0){
                        detailMessage += `Nama Guru yang sudah di absen:\n`;
                        sudah_absen.forEach((guru, index) => {
                            detailMessage += ` ${index + 1}. ${guru.nama_lengkap}\n `
                        });
                    }
                }
            }
            // alert(`${successMessage}\n\n${detailMessage}`);
        }
    };

    // Handle submit absensi
    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);

            const guruToSubmit = selectedGuru.length > 0
                ? guruList.filter(guru => selectedGuru.includes(guru.guru_id))
                : guruList;

            const guruWithStatus = guruToSubmit.filter(guru =>
                guru.status && guru.status !== 'Belum Presensi'
            );

            if (guruWithStatus.length === 0) {
                setAlertMessage('Tidak ada perubahan absensi untuk disimpan. Silakan pilih status untuk beberapa guru.');
                return;
            }
            
            const absensiData = guruToSubmit
                .filter(guru => ['Hadir', 'Tidak Hadir', 'Izin', 'Sakit'].includes(guru.status))
                .map(guru => ({
                    guru_id: guru.guru_id,
                    status: guru.status,
                    keterangan: guru.keterangan || null
                }));

            if (absensiData.length === 0) {
                alert('Silakan pilih status minimal untuk 1 guru sebelum menyimpan.');
                return;
            }

            console.log('Data yang akan dikirim:', absensiData);

            const result = await submitAbsensi(absensiData);
            showAbsensiResult(result);
            console.log('Result absensi guru:', result);

            await refetchGuru([]);
            setSelectedGuru([]);

        } catch (error) {
            console.error('Submit error:', error);
            alert('Gagal menyimpan absensi: ' + (error.response?.data?.[0]?.message || error.message));
        } finally {
            setSubmitLoading(false);
        }
    };

    useEffect (() => {
        if(submitResult){
            console.log('Submit result updated:', submitResult)
        }
    }, [submitResult])

    useEffect (() =>{
        if(alertMessage){
            const timer = setTimeout(() =>{
                setAlertMessage('');
            }, 5000);

            return () => clearTimeout(timer)
        }
    }, [alertMessage]);



    if (loading && !guruList.length) {
        return (
            <div className="m-10 bg-white rounded-xl p-5">
                <div className="flex justify-center items-center h-40">
                    <div className="text-lg">Memuat data guru...</div>
                </div>
            </div>
        );
    }

  return (
    <>
        <div className="m-10 bg-white rounded-xl p-5">
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <h1 className="text-2xl">Absensi Guru</h1>
                </div>
                <div className="flex justify-between items-center w-2/6">
                    <div className="relative">
                        <SearchBar  
                            placeholder="Cari Nama Guru"
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            value={searchTerm}
                        />
                    </div>
                    <div className="relative">
                        <GoDownload className="absolute text-white text-2xl left-3 top-1/2 transform -translate-y-1/2" />
                        <Button name="Unduh" className="border-gray-300 text-white pl-10 pr-3 bg-blue-800 hover:bg-blue-900" />
                    </div>
                </div>
            </div>

            {/* Filter Section */}
                <div className="mt-10">
                    {error && (
                        <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {submitResult && submitResult[0] && !alertMessage &&(
                        <div className={`mb-3 p-3 rounded ${
                            submitResult[0].message.includes('Berhasil')
                                ? 'bg-green-100 border border-green-400 text-green-700'
                                : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
                            }`}>

                            <strong>{submitResult[0].message}</strong>

                            {submitResult[0].payload && (
                                <div className="mt-2 text-sm">
                                    {submitResult[0].payload.detail.berhasil && submitResult[0].payload.detail.berhasil.length > 0 && (
                                        <p>Berhasil absen: {submitResult[0].payload.detail.berhasil.length} guru</p>
                                    )}

                                    {submitResult[0].payload.detail.sudah_absen && submitResult[0].payload.detail.sudah_absen.length > 0 && (
                                        
                                        <div className="text-yellow-600">
                                            <p>Sudah absen: {submitResult[0].payload.detail.sudah_absen.length} guru</p>
                                            <ul className="list-disc list-inside">
                                                {submitResult[0].payload.detail.sudah_absen.map((guru, index) => (
                                                    <li key={index}>{guru.nama}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* alert message */}
                    {alertMessage && (
                        <div className="border-2 border-red-400 bg-red-200 mb-10 py-4 px-4 rounded-md">
                            <p className="text-xl text-red-800" >{alertMessage}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mb-4">
                        <button
                            className="bg-gray-600 border-gray-300 text-xl text-white hover:bg-gray-700 py-2 px-4 rounded-xl cursor-pointer"
                            onClick={handleSelectAll}
                        >
                            Select All
                        </button>
                        <button
                            className="bg-green-400 border-gray-300 text-xl text-white hover:bg-green-500 py-2 px-4 rounded-xl cursor-pointer"
                            onClick={markSelectedPresent}
                            disabled={selectedGuru.length === 0}
                        >
                            Present
                        </button>
                        <button
                            className="bg-red-400 border-gray-300 text-xl text-white hover:bg-red-500 py-2 px-4 rounded-xl cursor-pointer"
                            onClick={markSelectedAbsent}
                            disabled={selectedGuru.length === 0}
                        >
                            Absent
                        </button>
                    </div>

                    {/* Table */}
                    <table className="table-auto w-full border-collapse text-center">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-3 py-2"></th>
                                <th className="px-3 py-2">No</th>
                                <th className="px-3 py-2">NIP</th>
                                <th className="px-3 py-2">Nama</th>
                                <th className="px-3 py-2">Jabatan</th>
                                <th className="px-3 py-2">Jam Masuk</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Surat Keterangan</th>
                                <th className="px-3 py-2">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredGuru.map((guru, index) => (
                                <tr key={guru.guru_id} className="border-b border-gray-300">
                                    <td className="px-3 py-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedGuru.includes(guru.guru_id)}
                                            onChange={() => handleSelectGuru(guru.guru_id)}
                                            disabled={guru.sudah_absen}
                                        />
                                    </td>
                                    <td className="px-3 py-2">{index + 1}</td>
                                    <td className="px-3 py-2">{guru.nip}</td>
                                    <td className="px-3 py-2">{guru.nama_lengkap}</td>
                                    <td className="px-3 py-2">{guru.jabatan}</td>
                                    <td className="px-3 py-2">{guru.jam_masuk}</td>
                                    <td className="px-3 py-2">
                                        <StatusBadge status={guru.status_display} />
                                    </td>
                                    <td className="px-3 py-2">
                                        <label className="border-2 border-gray-400 py-2 px-3 rounded-xl w-50 cursor-pointer">
                                            {guru.fileName}
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => updateGuruFile(index, e.target.files[0])}
                                                disabled={guru.sudah_absen}
                                            />
                                        </label>
                                    </td>
                                    <td className="px-3 py-2">
                                        <select
                                            value={guru.status}
                                            onChange={(e) => updateGuruStatus(index, e.target.value)}
                                            className="border border-gray-300 rounded px-2 py-1"
                                            disabled={guru.sudah_absen}
                                        >
                                            <option value="">Pilih Status</option>
                                            <option value="Hadir">Hadir</option>
                                            <option value="Tidak Hadir">Tidak Hadir</option>
                                            <option value="Izin">Izin</option>
                                            <option value="Sakit">Sakit</option>
                                        </select>
                                        {guru.sudah_absen && (
                                            <div className="text-xs text-yellow-600 mt-1">
                                                Sudah absen hari ini
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {filteredGuru.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="px-3 py-4 text-center text-gray-500">
                                        Tidak ada data guru
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Info Summary */}
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                        <h4 className="font-semibold mb-2">Summary Absensi Guru Hari Ini:</h4>
                        <div className="flex gap-4 text-sm">
                            <span className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                Hadir: {guruList.filter(g => g.status === 'Hadir').length}
                            </span>
                            <span className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                Tidak Hadir: {guruList.filter(g => g.status === 'Tidak Hadir').length}
                            </span>
                            <span className="flex items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                Izin: {guruList.filter(g => g.status === 'Izin').length}
                            </span>
                            <span className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                Sakit: {guruList.filter(g => g.status === 'Sakit').length}
                            </span>
                            <span className="flex items-center">
                                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                                Belum: {guruList.filter(g => !g.status || g.status === 'Belum Presensi').length}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end p-2">
                        <button
                            type="submit"
                            className="bg-blue-800 border-gray-400 text-xl text-white hover:bg-blue-900 px-4 py-2 rounded-xl cursor-pointer"
                            onClick={handleSubmit}
                            disabled={submitLoading || !guruList.length}
                        >
                            {submitLoading ? 'Menyimpan...' : 'Submit'}
                        </button>
                    </div>
                </div>
        </div>
    </>
  )
}

export default TeacherAttendance
