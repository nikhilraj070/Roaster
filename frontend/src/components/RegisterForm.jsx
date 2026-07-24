import { useState } from "react";
import { Flame, Eye, EyeOff, User } from "lucide-react";
import { useAuth } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";
export default function Register() {
   const [showPassword, setShowPassword] = useState(false);
   const [username,setUsername] =useState("");
   const [password,setPassword] =useState("");
   const {register,loading,error} = useAuth()
   const navigate = useNavigate()
   const handleSubmit =async (e)=>{
    e.preventDefault();
    try {
      const data = await register({username,password})
      console.log(data)
      navigate('/')
    } catch (error) {
      console.log(error?.response?.data);
    }
  }
  


  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111010] px-4">
      <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-500/20 blur-[120px] sm:h-80 sm:w-80" />
      <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-red-600/10 blur-[120px] sm:h-72 sm:w-72" />
      <div className="absolute top-1/2 right-0 h-52 w-52 rounded-full bg-orange-500/10 blur-[120px] sm:h-72 sm:w-72" />
      <div className="relative z-10 flex w-full max-w-md flex-col">
        <div className="mb-10 flex items-center justify-center gap-3">
          <Flame
            size={34}
            className="text-orange-500 drop-shadow-[0_0_15px_rgba(255,120,40,.8)]"
          />
          <h1 className="text-4xl font-black tracking-widest text-[#ffb195] drop-shadow-[0_0_25px_rgba(255,120,60,.6)] sm:text-5xl md:text-6xl">
            ROASTER
          </h1>
        </div>

   
        <div className="rounded-3xl border border-orange-500/10 bg-[#1B1716]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,.55)] backdrop-blur-xl sm:p-8 md:p-10">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Join The Roast
          </h2>
          <p className="mt-3 text-center text-sm italic text-[#d8aa95] sm:text-base">
            Enter the arena and unleash the burns.
          </p>

<form onSubmit={handleSubmit}>

          <div className="mt-8">
            <label className="text-xs font-semibold uppercase tracking-[3px] text-[#f6a77d] sm:text-sm">
              Username
            </label>
            <div className="relative mt-3">
              <User
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                placeholder="Choose a username"
                className="h-12 w-full rounded-xl border border-[#2d2d2d] bg-[#111111] pl-12 pr-4 text-sm text-white placeholder:text-gray-500 outline-none transition duration-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 sm:h-14 sm:text-base"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="text-xs font-semibold uppercase tracking-[3px] text-[#f6a77d] sm:text-sm">
              Password
            </label>
            <div className="relative mt-3">
              <input
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="h-12 w-full rounded-xl border border-[#2d2d2d] bg-[#111111] px-5 pr-14 text-sm text-white placeholder:text-gray-500 outline-none transition duration-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 sm:h-14 sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>
          {error && (
  <div className="mt-4 rounded-xl text-center  text-sm font-medium text-[#ffb195]">
    {error}
  </div>
)}
        <button className={`mt-8 ${loading?"disabled":""} flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#ff5b1f] via-[#ff671b] to-[#c63d00] text-lg font-bold text-white transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(255,94,0,.45)] active:scale-95 sm:mt-10 sm:h-14 sm:text-xl`}>
            Create Account
            <Flame size={20} />
          </button>



</form>

          <p className="mt-8 text-center text-sm text-[#d2b1a0]">
            Already roasting?{" "}
            <button
              type="button"
              onClick={()=>navigate('/login')}
              className="font-semibold text-orange-400 transition hover:text-orange-300"
            >
              Login
            </button>
          </p>
        </div>


      </div>
    </div>
  );
}
