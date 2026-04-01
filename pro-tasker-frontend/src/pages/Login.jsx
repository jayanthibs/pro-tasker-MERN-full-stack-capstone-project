import { useState } from "react";
import { userClient } from "../clients/api";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useValidateLogin } from "../hooks/useValidate.js";
import Logo from "../assets/protasker-logo2.png";
import loginImage from "../assets/login1.avif";


function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = useValidateLogin(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const { data } = await userClient.post("/login", form);
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/dashboard");
      } catch (error) {
        alert(error.response?.data?.message || "Something went wrong.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0f172a]">
      
      {/* Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-blue-600/30"></div>

      {/* Glow Effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-blue-500 rounded-full blur-3xl opacity-20"></div>

      {/* Card */}
      <div className="relative bg-white/95 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden max-w-5xl w-full">
        
        {/* Left Side */}
        <div className="lg:w-1/2 bg-indigo-50 flex flex-col items-center justify-center p-10 text-center">
          <img
            src={loginImage}
            alt="Login illustration"
            className="w-full max-w-md rounded-xl shadow-md mb-6"
          />

          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Manage Projects Smarter
          </h2>

          <p className="text-gray-700 text-base px-6">
            Plan, track, and collaborate seamlessly with ProTasker.
            Stay organized and boost your team’s productivity.
          </p>
        </div>

        {/* Right Side */}
        <div className="lg:w-1/2 p-12 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src={Logo}
              alt="ProTasker Logo"
              className="h-30"
            />
          </div>

          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Welcome back
          </h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-lg">
                Email
              </label>
              <input
                value={form.email}
                onChange={handleChange}
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-lg">
                Password
              </label>
              <input
                value={form.password}
                onChange={handleChange}
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg text-lg hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-700 text-base mt-6">
            Don’t have an account?{" "}
            <span
              className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;