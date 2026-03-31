//validation for register user
export const useValidateRegister = (form) => {
  let errors = {};

  if (!form.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!form.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(form.email)) {
    errors.email = "Invalid email";
  }

  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

  if (!form.password) {
    errors.password = "Password is required";
  } else if (!passwordPattern.test(form.password)) {
    errors.password =
      "Must be 8+ chars, include uppercase, lowercase, and number";
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

//validation for login user
export const useValidateLogin = (form) => {
  let errors = {};

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.email) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(form.email)) {
    errors.email = "Invalid email format";
  }

  // Password validation
  if (!form.password) {
    errors.password = "Password is required";
  } 
  // Optional: keep this minimal for login
  // Don't enforce strong rules here since user already registered
  else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
};