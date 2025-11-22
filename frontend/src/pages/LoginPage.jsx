import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios";

const LoginPage = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const Login = async (e) => {
    e.preventDefault();
    if(!username || !password){
      setMessage("Username dan Password wajib di isi");
      return;
    }
    try {
      await axios.post('http://localhost:5000/login',{
        username : username,
        password: password
      },{
        withCredentials: true
      }
    )
      navigate("/");
    } catch (error) {
      if(error.response){
        setMessage(error.response.data[0].message);
      }else{
        setMessage("Error tidak di ketahui");
      }
    }
  }

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="ring-2 ring-sky-500 w-full max-w-md flex flex-col p-8 rounded-xl shadow-lg bg-white">
        <h1 className="text-center text-2xl">Sekolah</h1>
        <p className="text-center text-xl">Attandace Management System</p>
        <form onSubmit={Login} className="flex flex-col mt-10 gap-5">
            <p className="text-center p-2 text-red-500" >{message}</p>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" className="bg-gray-300 text-2xl rounded-xl p-2 focus:outline-2"/>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" className="bg-gray-300 text-2xl rounded-xl p-2 mb-10 focus:outline-2"/>
            <button type="submit" className="text-2xl rounded-xl p-2 bg-sky-400 shadow-lg shadow-blue-500/50 hover:bg-sky-600  " >Login</button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
