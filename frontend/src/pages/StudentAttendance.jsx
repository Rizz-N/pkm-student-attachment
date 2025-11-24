import { useState, useEffect } from "react";
import { useAbsensi } from "../hooks/useAbsensi";
import { GoDownload } from "react-icons/go";
import Button from "../components/Button"
import SearchBar from "../components/SearchBar"
import { absensiService } from "../services/absensiService";
import StatusBadge from "../components/StatusBadge";

const StudentAttendance = () => {
    const { kelasList,
            selectedKelas,
            setSelectedKelas,
            selectedStudents,
            setSelectedStudents,
            muridList,
            absensiToday,
            loading,
            error,
            submitResult,
            updateMuridStatus,
            updateMuridKeterangan,
            updateMuridFile,
            markSelectedPresent,
            markSelectedAbsent,
            submitAbsensi,
            clearSubmitResult,
            refetchMurid
          } = useAbsensi();

    const [semester, setSemester] = useState('Ganjil');
    const [searchTerm, setSearchTerm] = useState('');
    const [submitLoading, setSubmitLoading] = useState (false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const filteredMurid = muridList.filter(murid => 
        murid.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        murid.nis?.includes(searchTerm)
    );

    // handle select checkbox
    const handleSelectStudent = (murid_id) => {
        setSelectedStudents(prev => 
            prev.includes(murid_id)
            ? prev.filter(id => id !== murid_id)
            : [...prev, murid_id]
        );
    }

    // handle select all
    const handleSelectAll = () => {
        if (selectedStudents.length === filteredMurid.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredMurid.map(murid => murid.murid_id));
        }
    }

    const showAbsensiResult = (result) => {
      if(result && result [0]){
        const { payload, message } = result[0];

        let successMessage = message;
        let detailMessage = '';

        if(payload){
          const { guru, berhasil, sudah_absen } = payload;

          if(berhasil && berhasil.length > 0){
            detailMessage += `Berhasil absen ${berhasil.length} murid\n` 
            
            if(sudah_absen && sudah_absen.length > 0 ){
              detailMessage += `Nama yang sudah di absen:\n`;
              sudah_absen.forEach((murid, index) => {
                detailMessage += `${index +1}. ${murid.nama_lengkap}\n`;
              });
            }
          }
        }
        // alert(`${successMessage}\n\n${detailMessage}`);
      }
    }

    // handle submit absensi
    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);
            clearSubmitResult();

            const muridToSubmit = selectedStudents.length > 0
                ? muridList.filter(murid => selectedStudents.includes(murid.murid_id))
                : muridList;

            const muridWithStatus = muridToSubmit.filter(murid => 
                murid.status && murid.status !== 'Belum Presensi'
            );

            if (muridWithStatus.length === 0) {
                alert('Tidak ada perubahan absensi untuk disimpan. Silakan pilih status untuk beberapa murid.');
                return;
            }

            const absensiData = muridToSubmit
            .filter(murid => ['Hadir', 'Alpha', 'Izin', 'Sakit'].includes(murid.status))
            .map(murid => ({
                murid_id: murid.murid_id,
                status: murid.status,
                keterangan: murid.keterangan,
                semester: semester
            }));

            if(absensiData.length === 0){
              alert('Silakan pilih status minimal untuk 1 guru sebelum menyimpan.');
              result;
            }

            console.log('data yang akan di kirim:', absensiData);

            const result = await submitAbsensi(absensiData);
            
            showAbsensiResult(result);
            
            console.log('Result absensi:', result);

            if(selectedKelas){
                await refetchMurid();
            }
            setSelectedStudents([]);
        } catch (error) {
            console.error('Submit error', error);
            // alert('Gagal menyimpan absensi'+ (error.response?.data?.[0]?.message || error.message));
        }finally{
          setSubmitLoading(false)
        }
    };

    useEffect(() => {
        if (submitResult) {
            console.log('Submit result updated:', submitResult);
        }
    }, [submitResult]);

    useEffect(() => {
        clearSubmitResult();
    }, [selectedKelas]);

    useEffect(()=>{
      if(kelasList && kelasList.length > 0 && ! selectedKelas){
        setSelectedKelas(kelasList[0].kelas_id);
      }
    },[kelasList, selectedKelas]);

    if (loading && !muridList.length) {
        return(
            <div className="m-10 bg-white rounded-xl p-5">
                <div className="flex justify-center items-center h-40">
                    <div className="text-lg">Memuat data...</div>
                </div>
            </div>
        )
    }
    return (
        <>
          <div className="m-10 bg-white rounded-xl p-5">
            <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-2xl">Absensi Siswa</h1>
            </div>

            <div className="flex justify-between w-100 items-center">
              <div className="relative">
                <SearchBar 
                  placeholder="Cari Nama Siswa"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <GoDownload className="absolute text-white text-2xl left-3 top-1/2 transform -translate-y-1/2"/>
                <Button 
                  name="Unduh" 
                  className="border-gray-300 text-white pl-10 pr-3 bg-blue-800 hover:bg-blue-900"
                />
              </div>
            </div>
          </div>

        {/* Filter Section */}
        <div className="mt-10">
          <div className="flex gap-4 mb-3">
            <div className="w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Kelas
              </label>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {(kelasList || []).map((kelas) => (
                  <option key={kelas.kelas_id} value={kelas.kelas_id}>
                    {kelas.nama_kelas}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          {selectedKelas && (
            <p className="mb-3 text-sm text-gray-600">
              Menampilkan data untuk: <span className="font-semibold">
                {(kelasList || []).find(k => k.kelas_id == selectedKelas)?.nama_kelas}
              </span>
            </p>
          )}

          {error && (
            <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Success Message */}
                    {submitResult && submitResult[0] && (
                        <div className={`mb-3 p-3 rounded ${
                            submitResult[0].message.includes('Berhasil') 
                                ? 'bg-green-100 border border-green-400 text-green-700'
                                : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
                        }`}>
                            <strong>{submitResult[0].message}</strong>
                            {submitResult[0].payload && (
                                <div className="mt-2 text-sm">
                                    {submitResult[0].payload.berhasil && submitResult[0].payload.berhasil.length > 0 && (
                                        <p>Berhasil absen: {submitResult[0].payload.berhasil.length} murid</p>
                                    )}
                                    {submitResult[0].payload.sudah_absen && submitResult[0].payload.sudah_absen.length > 0 && (
                                        <div>
                                            <p>Sudah absen: {submitResult[0].payload.sudah_absen.length} murid</p>
                                            <ul className="list-disc list-inside">
                                                {submitResult[0].payload.sudah_absen.map((murid, index) => (
                                                    <li key={index}>{murid.nama}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <button className="bg-gray-600 border-gray-300 text-xl text-white hover:bg-gray-700 py-2 px-4 rounded-xl cursor-pointer"
                    onClick={handleSelectAll}>
                Select All
            </button>
            
            <button className="bg-green-400 border-gray-300 text-xl text-white hover:bg-green-500 py-2 px-4 rounded-xl cursor-pointer"
                    onClick={markSelectedPresent}
                    disabled={selectedStudents.length === 0}>
                Present
            </button>
            <button className="bg-red-400 border-gray-300 text-xl text-white hover:bg-red-500 py-2 px-4 rounded-xl cursor-pointer"
                    onClick={markSelectedAbsent}
                    disabled={selectedStudents.length === 0}>
                Absent
            </button>
          </div>

          {/* Table */}
          <table className="table-auto w-full border-collapse text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-3 py-2"></th>
                <th className="px-3 py-2">No</th>
                <th className="px-3 py-2">NIS</th>
                <th className="px-3 py-2">Nama Lengkap</th>
                <th className="px-3 py-2">Jenis Kelamin</th>
                <th className="px-3 py-2">Surat Keterangan</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredMurid.map((murid, index) => (
                <tr key={murid.murid_id} className="border-b border-gray-300">
                  <td className="px-3 py-3">
                    <input  type="checkbox" 
                            checked={selectedStudents.includes(murid.murid_id)}
                            onChange={() => handleSelectStudent(murid.murid_id)} 
                            disabled={murid.sudah_absen}
                    />
                  </td>
                  <td className="px-3 py-3">{index + 1}</td>
                  <td className="px-3 py-3">{murid.nis}</td>
                  <td className="px-3 py-3">{murid.nama_lengkap}</td>
                  <td className="px-3 py-3">{murid.jenis_kelamin}</td>
                  <td className="px-3 py-3">
                    <label className="inline-block border-2 border-gray-400 py-1 px-4 rounded-xl cursor-pointer ">
                      {murid.fileName}
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => updateMuridFile(index, e.target.files[0])}
                      />
                    </label>
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={murid.status_display} />
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={murid.status}
                      onChange={(e) => updateMuridStatus(index, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                      disabled={murid.sudah_absen}
                    >
                      <option value="">Pilih Status</option>
                      <option value="Hadir">Hadir</option>
                      <option value="Izin">Izin</option>
                      <option value="Sakit">Sakit</option>
                      <option value="Alpha">Alpha</option>
                    </select>
                    {murid.sudah_absen && (
                      <div className="text-xs text-yellow-600 mt-1">
                        Sudah absen hari ini
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredMurid.length === 0 && selectedKelas && (
                <tr>
                  <td colSpan="8" className="px-3 py-4 text-center text-gray-500">
                    Tidak ada data murid untuk kelas ini
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Info summary */}
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <h4 className="font-semibold mb-2">Summary Absensi Hari Ini:</h4>
                    <div className="flex gap-4 text-sm">
                        <span className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            Hadir: {muridList.filter(m => m.status === 'Hadir').length}
                        </span>
                        <span className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            Izin: {muridList.filter(m => m.status === 'Izin').length}
                        </span>
                        <span className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            Sakit: {muridList.filter(m => m.status === 'Sakit').length}
                        </span>
                        <span className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            Alpha: {muridList.filter(m => m.status === 'Alpha').length}
                        </span>
                        <span className="flex items-center">
                            <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                            Belum: {muridList.filter(m => m.status === 'Belum Presensi').length}
                        </span>
                    </div>
                </div>            
          
            <div className="flex justify-end p-2">
                <button type="submit"
                        className="bg-blue-800 border-gray-400 text-xl text-white hover:bg-blue-900 px-4 py-2 rounded-xl  cursor-pointer"
                        onClick={handleSubmit}
                        disabled={submitLoading || !muridList.length}>
                    Submit
                </button>
          </div>
        </div>
      </div>
        </>
    )
}
export default StudentAttendance
