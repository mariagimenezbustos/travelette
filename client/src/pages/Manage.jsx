import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Manage() {
	const [login, setLogin] = useState(true);

	const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        console.log("You're logged out");
		setLogin(false);
    };

	useEffect(() => {
		if (localStorage.getItem("token") !== null || localStorage.getItem("username") !== null) {
			setLogin(true);
		} else {
			setLogin(false)
		}
	}, []);

	return (
		<section className="wrapper">
			<h2>Manage Account Settings</h2>

			{login ? (
				<button className="" onClick={logout}>
                	Log out
            	</button>
			) : (
				<Link to="/"><button>Log in</button></Link>
			)}
		</section>
	)
}
