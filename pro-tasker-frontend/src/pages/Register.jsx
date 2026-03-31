import { useState } from "react";
import { validateRegister } from "../hooks/useValidate.js";
import { userClient } from "../clients/api.js";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";

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

    // Clear error for that field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegister(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Form submitted:", form);

      try {
        const { data } = await userClient.post("/register", form);
        console.log(data);
        localStorage.setItem("token", data.token);

        setUser(data.newUser);

        navigate("/dashboard");
        
      } catch (error) {
        console.log(error);
        alert(error.response.data.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-[10px]">
      <h1>User Registration Form</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="firstName">Firstname:</label>
          <input
            className="border"
            type="text"
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            autoComplete="given-name"
            placeholder="Firstname"
            required
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="lastName">Lastname:</label>
          <input
            className="border"
            type="text"
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            autoComplete="family-name"
            placeholder="lastname"
            required
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email:</label>
          <input
            className="border"
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="email"
            required
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="password">Password:</label>
          <input
            className="border"
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="password"
            required
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm-Password:</label>
          <input
            className="border"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="retype-password"
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        <button type="submit" className="border m-auto">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
