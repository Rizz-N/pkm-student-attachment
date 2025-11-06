import Card from "../components/Card"
const Overview = () => {
  return (
    <>
        <div className="mx-10 flex justify-between gap-4 bg-white p-10 rounded-xl ">
            <Card container="bg-gray-200 ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" top="flex justify-between items-center" title="Total Teacher" source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png" rstyle="text-4xl mt-10" result="45" />
            <Card container="bg-gray-200 ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" top="flex justify-between items-center" title="Teacher Present today" source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png" rstyle="text-4xl mt-10" result="43" />
            <Card container="bg-gray-200 ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" top="flex justify-between items-center" title="Total Student" source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png" rstyle="text-4xl mt-10" result="850" />
            <Card container="bg-gray-200 ring-3 ring-gray-300 p-5 flex-1 rounded-xl shadow-xl shadow-gray-500/50" top="flex justify-between items-center" title="Student Present today" source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png" rstyle="text-4xl mt-10" result="789" />
        </div>
    </>
  )
}

export default Overview
