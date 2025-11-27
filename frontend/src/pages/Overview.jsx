import Card from "../components/Card";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUserFriends,
} from "react-icons/fa";
import { useGetTotal } from "../hooks/useGetTotal";
import { useLoading } from "../hooks/useLoading";

const Overview = () => {
  const { total, totalMurid, totalGuruHadir, totalMuridHadir, loading, error } =
    useGetTotal();

  const animatedTotalTeacher = useLoading(total);
  const animatedTotalStudent = useLoading(totalMurid);
  const animatedTotalTeacherPresence = useLoading(totalGuruHadir);
  const animatedTotalStudentPresence = useLoading(totalMuridHadir);

  if (loading) {
    return (
      <div className="mx-4 md:mx-10 grid grid-cols-2 lg:grid-cols-4 gap-6 bg-transparent p-4 md:p-10">
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-gray-300/30 p-6 flex-1 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          top="flex justify-between items-center"
          title="Total Teacher"
          icon={<FaChalkboardTeacher />}
          rstyle="text-4xl mt-8 font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent"
          result="0"
        />
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-gray-300/30 p-6 flex-1 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          top="flex justify-between items-center"
          title="Teacher Present Today"
          icon={<FaUserFriends />}
          rstyle="text-4xl mt-8 font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"
          result="0"
        />
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-gray-300/30 p-6 flex-1 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          top="flex justify-between items-center"
          title="Total Student"
          icon={<FaUserGraduate />}
          rstyle="text-4xl mt-8 font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent"
          result="0"
        />
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-gray-300/30 p-6 flex-1 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          top="flex justify-between items-center"
          title="Student Present Today"
          icon={<FaUserFriends />}
          rstyle="text-4xl mt-8 font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
          result="0"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 md:mx-10 grid grid-cols-1 lg:grid-cols-4 gap-6 bg-transparent p-4 md:p-10">
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-gray-300/30 p-6 flex-1 rounded-2xl shadow-lg"
          top="flex justify-between items-center"
          title="Total Teacher"
          source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png"
          rstyle="text-4xl mt-8 font-bold text-gray-400"
          result="Error"
        />
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-gray-300/30 p-6 flex-1 rounded-2xl shadow-lg"
          top="flex justify-between items-center"
          title="Teacher Present today"
          source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png"
          rstyle="text-4xl mt-8 font-bold text-gray-400"
          result="Error"
        />
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-gray-300/30 p-6 flex-1 rounded-2xl shadow-lg"
          top="flex justify-between items-center"
          title="Total Teacher"
          source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png"
          rstyle="text-4xl mt-8 font-bold text-gray-400"
          result="Error"
        />
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-gray-300/30 p-6 flex-1 rounded-2xl shadow-lg"
          top="flex justify-between items-center"
          title="Teacher Present today"
          source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png"
          rstyle="text-4xl mt-8 font-bold text-gray-400"
          result="Error"
        />
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 mx-4 md:mx-10 grid grid-cols-2 lg:grid-cols-4 gap-6 bg-transparent p-4 md:p-10">
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-yellow-300/30 p-6 flex-1 rounded-2xl shadow-xl"
          top="flex justify-between items-center"
          title="Total Teacher"
          icon={<FaChalkboardTeacher className="text-3xl text-yellow-600" />}
          result={animatedTotalTeacher.toString()}
          rstyle="text-4xl mt-8 font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent"
        />
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-green-300/30 p-6 flex-1 rounded-2xl shadow-xl"
          top="flex justify-between items-center"
          title="Teacher Present Today"
          icon={<FaUserFriends className="text-3xl text-green-600" />}
          result={animatedTotalTeacherPresence.toString()}
          rstyle="text-4xl mt-8 font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"
        />
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-indigo-300/30 p-6 flex-1 rounded-2xl shadow-xl"
          top="flex justify-between items-center"
          title="Total Student"
          icon={<FaUserGraduate className="text-3xl text-indigo-600" />}
          result={animatedTotalStudent.toString()}
          rstyle="text-4xl mt-8 font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent"
        />
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-blue-300/30 p-6 flex-1 rounded-2xl shadow-xl"
          top="flex justify-between items-center"
          title="Student Present Today"
          icon={<FaUserFriends className="text-3xl text-blue-600" />}
          result={animatedTotalStudentPresence.toString()}
          rstyle="text-4xl mt-8 font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
        />
      </div>
    </>
  );
};

export default Overview;
