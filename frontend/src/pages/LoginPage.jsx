
const LoginPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="ring-2 ring-sky-500 h-3/5 w-2/6 flex flex-col p-10 rounded-xl">
        <h1 className="text-center text-2xl">Sekolah</h1>
        <p className="text-center text-xl">Attandace Management System</p>
        <form className="flex flex-col mt-10 gap-5">
            <input type="text" placeholder="username" className="bg-gray-300 text-2xl rounded-xl p-2 focus:outline-2"/>
            <input type="password" placeholder="password" className="bg-gray-300 text-2xl rounded-xl p-2 mb-10 focus:outline-2"/>
            <button type="submit" className="text-2xl rounded-xl p-2 bg-sky-400 shadow-lg shadow-blue-500/50 hover:bg-sky-600  " >Login</button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
