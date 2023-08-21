import { useState } from "react";
import axios from "axios";

function Login() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const [data, setData] = useState(null);

    const { username, password } = credentials;

    const login = async () => {
        try {
        const { data } = await axios("/api/auth/login", {
            method: "POST",
            data: credentials,
        });
    
        //store it locally
        localStorage.setItem("token", data.token);
        console.log(data.message, data.token);
        setData(data.message);
        } catch (error) {
        console.log(error);
        setData(error.message);
        };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const logout = () => {
        localStorage.removeItem("token");
        console.log("You're logged out");
    };

    const requestData = async () => {
        try {
            const { data } = await axios("/api/auth/profile", {
              headers: {
                authorization: "Bearer " + localStorage.getItem("token"),
              },
            });
            setData(data.message);
            console.log(data.message);
        } catch (error) {
            console.log(error);
            setData(error.message);
        }
    };

    return (
        <section className="wrapper">
            <h2>Login Page</h2>

            <div>
                <input
                value={username}
                onChange={handleChange}
                name="username"
                type="text"
                className=""
                />
                <input
                value={password}
                onChange={handleChange}
                name="password"
                type="password"
                className=""
                />
                <div className="">
                <button className="" onClick={login}>
                    Log in
                </button>
                <button className="" onClick={logout}>
                    Log out
                </button>
                </div>
            </div>
            <div className="">
                <button className="" onClick={requestData}>
                Request protected data
                </button>
            </div>

            {data && (
                <div className="">
                    <div className="alert">{data}</div>
                </div>
            )}
        </section>
    )
};

export default Login;
