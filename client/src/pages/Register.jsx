import {useState} from 'react';
import axios from "axios";
import { Link } from "react-router-dom";

export default function Register() {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
  });
  const [data, setData] = useState(null);
  const { firstname, lastname, username, password } = userData;

  const register = async () => {
    try {
    const { data } = await axios("/api/auth/register", {
        method: "POST",
        data: userData,
    });

    // store it locally
    // localStorage.setItem("token", data.token);
    console.log(data.message);
    setData(data.message);

    } catch (error) {
    console.log(error);
    setData(error.message);
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <section className="wrapper">
        <h2>Register Page</h2>

        {!data ? (
          <div>
          <label>
              Your name
            <input
            value={firstname}
            onChange={handleChange}
            name="firstname"
            type="text"
            className=""
            />
            <br/>
            <label>
              Your lastname
            <input
            value={lastname}
            onChange={handleChange}
            name="lastname"
            type="text"
            className=""
            />
            </label>
            <br/>
            </label>
            <label>
              Give yourself a username
            <input
            value={username}
            onChange={handleChange}
            name="username"
            type="text"
            className=""
            />
            </label>
            <br/>
            <label>
              Add a password
            <input
            value={password}
            onChange={handleChange}
            name="password"
            type="password"
            className=""
            />
            </label>
            <div className="">
            <button className="" onClick={register}>
                Register
            </button>
            </div>
          </div>) :

          (<div className="">
            <div className="alert">{data}</div>
            <Link to="/login">Log in</Link>
          </div>
        )}
    </section>
  )
}
