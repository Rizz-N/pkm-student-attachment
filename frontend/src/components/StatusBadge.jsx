const StatusBadge = ({status}) => {
  const getStatusColor = (status) => {
    switch (status){
        case 'Hadir':
            return 'bg-green-400';
          case 'Izin':
            return 'bg-blue-400';
        case 'Sakit':
            return 'bg-yellow-400';
        case 'Alpha':
            return 'bg-red-400';
        case 'Tidak Hadir':
            return 'bg-red-400';
        case 'Belum Presensi':
        default:
            return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch(status){
        case 'Hadir': return 'Hadir';
        case 'Izin': return 'Izin';
        case 'Sakit': return 'Sakit';
        case 'Alpha': return 'Alpha';
        case 'Tidak Hadir': return 'Tidak Hadir';
        case 'Belum Presensi': return 'Belum Presensi';
        default: return status;
    }
  };
  
  return(
    <span className={`inline-block w-40 py-1 rounded-xl font-bold ${getStatusColor(status)}`}>
        {getStatusText(status)}
    </span>
  );
};

export default StatusBadge
