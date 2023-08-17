import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Trips() {

	const [trips, setTrips] = useState([]);

	useEffect(() => {
		getTrips()
	}, []);

	const getTrips = () => {
		fetch("/api/trips")
			.then(response => response.json())
			.then(trips => {
				console.log(trips);
				setTrips(trips);
			})
			.catch(error => {
				console.log(error);
			});
	};

	return (
		<section className="wrapper">
			<h2>Trips</h2>

			<ul className="tripContent">
					{trips.map(entry => (
						<li key ={entry.id}>
							<Link className="tripRow" to={`/transactions/trip/${entry.id}`}>
								<div>{entry.destination}</div>
								{entry.trip_description && <div>{entry.trip_description}</div>}
							</Link>
						</li>
					))}
			</ul>

		</section>
	)
}
