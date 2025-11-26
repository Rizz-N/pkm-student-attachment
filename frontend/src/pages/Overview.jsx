import Card from "../components/Card"
import { FaChalkboardTeacher, FaUserGraduate, FaUserFriends } from "react-icons/fa";
import { useGetTotal } from "../hooks/useGetTotal"
const Overview = () => {
  const { total, totalMurid, totalGuruHadir, totalMuridHadir, loading, error} = useGetTotal();

  if (loading) {
        return (
            <div className="mx-10 flex justify-between gap-4 bg-white p-10 rounded-xl">
                <Card 
                    container="bg-gray-200 ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                    top="flex justify-between items-center" 
                    title="Total Teacher" 
                    source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png" 
                    rstyle="text-4xl mt-10" 
                    result="Loading..." 
                />
                <Card container="bg-gray-200 ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Teacher Present today" 
                  source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png" 
                  rstyle="text-4xl mt-10" 
                  result="Loading..." />
                <Card 
                    container="bg-gray-200 ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                    top="flex justify-between items-center" 
                    title="Total Teacher" 
                    source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png" 
                    rstyle="text-4xl mt-10" 
                    result="Loading..." 
                />
                <Card container="bg-gray-200 ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Teacher Present today" 
                  source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png" 
                  rstyle="text-4xl mt-10" 
                  result="Loading..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-10 flex justify-between gap-4 bg-white p-10 rounded-xl">
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
        <div className="mx-10 flex justify-between gap-4 bg-white p-10 rounded-xl ">
            <Card container="bg-gradient-to-b from-white-500 from-90% to-yellow-600 to-10% ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Total Teacher" 
                  icon={<FaChalkboardTeacher/>}
                  rstyle="text-4xl mt-10" 
                  result={total.toString()} />
            <Card container="bg-gradient-to-b from-white-500 from-90% to-green-600 to-10% ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Teacher Present today" 
                  icon={<FaUserFriends/>} 
                  rstyle="text-4xl mt-10" 
                  result={totalGuruHadir.toString()} />
            <Card container="bg-gradient-to-b from-white-500 from-90% to-indigo-600 to-10% ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Total Student" 
                  icon={<FaUserGraduate/>}
                  rstyle="text-4xl mt-10" 
                  result={totalMurid.toString()} />
            <Card container="bg-gradient-to-b from-white-500 from-90% to-blue-600 to-10% ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" 
                  top="flex justify-between items-center" 
                  title="Student Present today" 
                  icon={<FaUserFriends/>}
                  rstyle="text-4xl mt-10" 
                  result={totalMuridHadir.toString()} />
        </div>
    </>
  )
}

export default Overview
