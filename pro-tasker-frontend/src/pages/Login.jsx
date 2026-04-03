import { useState } from "react";
import { userClient } from "../clients/api";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useValidateLogin } from "../hooks/useValidate.js";
import Logo from "../assets/protasker-logo2.png";
import loginImage from "../assets/login.png";


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
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0f172a] px-4">

    {/* Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-300/20 to-blue-600/30"></div>

    {/* Glow */}
    <div className="absolute top-[-80px] left-[-80px] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-purple-200 rounded-full blur-3xl opacity-20"></div>
    <div className="absolute bottom-[-100px] right-[-100px] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-blue-200 rounded-full blur-3xl opacity-20"></div>

    {/* Card */}
<div className="relative bg-white/95 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden max-w-4xl xl:max-w-5xl w-full">

  {/* LEFT */}
  <div className="hidden lg:flex lg:w-1/2 bg-indigo-50 flex-col items-center justify-center p-10 xl:p-14 text-center">
  
  <img
    src={loginImage}
    alt="Login illustration"
    className="w-full max-w-lg xl:max-w-xl 2xl:max-w-2xl rounded-2xl shadow-lg mb-8 object-contain"
  />

  <h2 className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-800 mb-3">
    Manage Projects Smarter
  </h2>

  <p className="text-gray-700 text-sm xl:text-base px-6">
    Plan, track, and collaborate seamlessly with ProTasker.
    Stay organized and boost your team’s productivity.
  </p>
</div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">

        {/* Logo */}
        <div className="flex justify-center mb-4">
  <img
    src={Logo}
    alt="Logo"
    className="h-20 sm:h-24 lg:h-28 object-contain"
  />
</div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 text-center">
          Welcome back
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Email
            </label>
            <input
              value={form.email}
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="username"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Password
            </label>
            <input
              value={form.password}
              onChange={handleChange}
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base hover:bg-indigo-700 transition cursor-pointer"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-700 text-sm sm:text-base mt-6">
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