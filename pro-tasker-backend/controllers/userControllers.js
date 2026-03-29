import User from "../models/User.js";
import { signToken } from "../utils/auth.js";
import bcrypt from 'bcrypt';

//function for registering a user
export async function createUser(req, res) {
  try {
    const newUser = await User.create(req.body);
    const token = signToken(newUser);
    console.log(newUser);
    res.status(201).json({ token, newUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}

//function for login

export async function loginUser(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    //check if the user exists
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }
    //check the password

    const correctPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!correctPassword) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const token = signToken(user);
    console.log(user);
    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}
