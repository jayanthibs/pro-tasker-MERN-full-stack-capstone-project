import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { token, userClient } from "../clients/api";

const UserContext = createContext(null);

//check if there is a token, if so assume that there's a user

const initialUser = token() ? { firstName: null, lastName: null } : null;

//custom provider to wrap our app
function UserProvider({ children }) {
  //set the initial state the null or a temporary user(username:null)
  const [user, setUser] = useState(initialUser);

  const navigate = useNavigate();

  //useEffect that verifies the token and retrieves the user data

  useEffect(() => {
    async function getUser() {
      //check if there is a token (if no token then we can skip the steps)

      try {
        // localStorage.getItem('token');

        if (!token()) {
          return;
        }

        //use the token to verify the user (is token valid? is it expired?)

        // const user = await userClient.get('/');
        // console.log(user);

        const { data } = await userClient.get("/");

        //to check or to slowdown the process manually

        // await new Promise((res) =>{ setTimeout(res, 2000)});

       // console.log(data);

        //if verified that token is legit, take the user data and save it to state

        setUser(data);
      } catch (error) {
        // if verification fails, logout the user
        console.log(error);
        logout();
      }
    }
    getUser();
  }, []);

  const logout = () => {
    //clear the user state

    setUser(null);

    //clear the local storage

    localStorage.removeItem("token");

    //navigate the user to login
    navigate("/login");
  };

  const value = {
    user,
    setUser,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

//custom hook to easily access context value
export function useUser() {
  return useContext(UserContext);
}

export default UserProvider;
