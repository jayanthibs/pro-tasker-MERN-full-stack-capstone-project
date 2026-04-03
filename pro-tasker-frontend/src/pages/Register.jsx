
import { useState } from "react";
import { useValidateRegister } from "../hooks/useValidate.js";
import { userClient } from "../clients/api.js";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import Logo from "../assets/protasker-logo2.png";
import registerImage from "../assets/register.png";

function Register() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = useValidateRegister(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const { data } = await userClient.post("/register", form);
        localStorage.setItem("token", data.token);
        setUser(data.newUser);
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

    {/* LEFT (Hidden on mobile) */}
<div className="hidden lg:flex lg:w-1/2 p-4">
  
  <div className="w-full h-full flex flex-col bg-indigo-50 rounded-2xl overflow-hidden">
    
    {/* Image */}
    <div className="flex-1 overflow-hidden">
      <img
        src={registerImage}
        alt="Register"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Bottom Text */}
    <div className="p-6 xl:p-8 text-center">
      <h2 className="text-xl xl:text-2xl font-bold text-gray-800 mb-2">
        Join ProTasker Today
      </h2>

      <p className="text-gray-600 text-sm xl:text-base px-4">
        Create your account and start managing projects efficiently.
        Collaborate, track progress, and stay productive.
      </p>
    </div>

  </div>
</div>

    {/* RIGHT */}
    <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">

      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img src={Logo} alt="Logo" className="h-16 sm:h-20 lg:h-24" />
      </div>

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 text-center">
        Register
      </h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">

        {/* First + Last Name */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full">
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          <div className="w-full">
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            autoComplete="username"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base hover:bg-indigo-700 transition cursor-pointer"
        >
          Register
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-gray-600 text-sm sm:text-base mt-6">
        Already have an account?{" "}
        <span
          className="text-indigo-600 font-semibold hover:underline cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  </div>
</div>
  );
}

export default Register;

