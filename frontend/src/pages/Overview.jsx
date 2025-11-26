import Card from "../components/Card"
import { FaChalkboardTeacher, FaUserGraduate, FaUserFriends } from "react-icons/fa";
import { useGetTotal } from "../hooks/useGetTotal"
const Overview = () => {
  const { total, totalMurid, totalGuruHadir, totalMuridHadir, loading, error} = useGetTotal();

  if (loading) {
        return (
            <div className="mx-4 md:mx-10 grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white p-4 md:p-10 rounded-xl">
                <Card 
                  container="bg-gradient-to-b from-white-500 from-90% to-yellow-600 to-10% ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Total Teacher" 
                  icon={<FaChalkboardTeacher/>}
                  rstyle="text-4xl mt-10" 
                  result="Loading" 
                  />
                <Card 
                  container="bg-gradient-to-b from-white-500 from-90% to-green-600 to-10% ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Teacher Present Today" 
                  icon={<FaUserFriends/>}
                  rstyle="text-4xl mt-10" 
                  result="Loading" 
                  />
                <Card 
                  container="bg-gradient-to-b from-white-500 from-90% to-indigo-600 to-10% ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Total Student" 
                  icon={<FaUserGraduate/>}
                  rstyle="text-4xl mt-10" 
                  result="Loading" 
                  />
                <Card 
                  container="bg-gradient-to-b from-white-500 from-90% to-blue-600 to-10% ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Student Present Today" 
                  icon={<FaUserFriends/>}
                  rstyle="text-4xl mt-10" 
                  result="Loading" 
                  />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-4 md:mx-10 grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white p-4 md:p-10 rounded-xl">
                <Card 
                    container="bg-gray-200 ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                    top="flex justify-between items-center" 
                    title="Total Teacher" 
                    source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png" 
                    rstyle="text-4xl mt-10" 
                    result="Error" 
                />
                <Card container="bg-gray-200 ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Teacher Present today" 
                  source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png" 
                  rstyle="text-4xl mt-10" 
                  result="Error" 
                />
                <Card 
                    container="bg-gray-200 ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                    top="flex justify-between items-center" 
                    title="Total Teacher" 
                    source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png" 
                    rstyle="text-4xl mt-10" 
                    result="Error" 
                />
                <Card container="bg-gray-200 ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Teacher Present today" 
                  source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png" 
                  rstyle="text-4xl mt-10" 
                  result="Error" 
                />
            </div>
        );
    }

  return (
    <>
        <div className="mx-4 md:mx-10 grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white p-4 md:p-10 rounded-xl">
            <Card container="bg-gradient-to-b from-white-500 from-90% to-yellow-600 to-10% ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Total Teacher" 
                  icon={<FaChalkboardTeacher/>}
                   
                  result={total.toString()} />
            <Card container="bg-gradient-to-b from-white-500 from-90% to-green-600 to-10% ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Teacher Present Today" 
                  icon={<FaUserFriends/>} 
                   
                  result={totalGuruHadir.toString()} />
            <Card container="bg-gradient-to-b from-white-500 from-90% to-indigo-600 to-10% ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Total Student" 
                  icon={<FaUserGraduate/>}
                   
                  result={totalMurid.toString()} />
            <Card container="bg-gradient-to-b from-white-500 from-90% to-blue-600 to-10% ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Student Present Today" 
                  icon={<FaUserFriends/>}
                   
                  result={totalMuridHadir.toString()} />
        </div>
    </>
  )
}

export default Overview
