import { useState } from "react";
import { userClient } from "../clients/api";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useValidateLogin } from "../hooks/useValidate.js";
function Login() {
  //bring in the setter function from the context
  const { setUser } = useUser();

  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    // Clear error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = useValidateLogin(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Login data:", form);
      try {
        //send form to our backend

        const { data } = await userClient.post("/login", form);
        console.log(data.user);

        //take the token and store it locally
        localStorage.setItem("token", data.token);

        //save some user data in our state

        setUser(data.user);

        
        //take the user to a diferent page
        navigate("/dashboard");
        
      } catch (error) {
        console.log(error);
        alert(error.response.data.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit} noValidate>

        <div className="mb-3">
          <label htmlFor="email">Email:</label>
          <input
            value={form.email}
            onChange={handleChange}
            id="email"
            name="email"
            type="email"
            placeholder="Enter the email"
            autoComplete="email"
            required
            className="border"
          />
          {errors.email && (
              <p className="text-red-500">{errors.email}</p>
            )}
        </div>

        <div className="mb-3">
          <label htmlFor="password">Password:</label>
          <input
            value={form.password}
            onChange={handleChange}
            id="password"
            name="password"
            type="password"
            placeholder="Enter the password"
            autoComplete="current-password"
            required
            className="border"
          />
          {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
        </div>

        <button type="submit" className="border">Login</button>
      </form>
    </div>
  );
}

export default Login;
