import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function Trip() {
	const [trip, setTrip] = useState([]);
	const { id } = useParams();

	useEffect(() => {
		getTrip();
	}, [id]);

	const getTrip = () => {
		fetch(`/api/transactions/trip/${id}`)
			.then(response => response.json())
			.then(trip => {
				console.log(trip);
				setTrip(trip);
			})
			.catch(error => {
				console.log(error);
		});
	};



	return (
	<section className="tripPage wrapper">
		<h2>Trip Details: 
			{/* {trip.destination} this needs to get fixed */}
		</h2>

		<section className="tripList">
			<div className="tripHeader">
				<div><a href="#"></a>DATE</div>
				<div><a href="#"></a>MERCHANT</div>
				<div><a href="#"></a>CATEGORY</div>
				<div><a href="#"></a>AMOUNT</div>
				<div><a href="#"></a>CURRENCY</div>
				<div><a href="#"></a>PAYER</div>
			</div>
			<ul className="tripContent">
					{trip.map(entry => (
						<li key={entry.id}>
							<Link className="tripRow" to={`/transactions/${entry.id}`}>
								<div>{entry.date.split("T")[0]} </div>
								<div>{entry.merchant} </div>
								<div>{entry.name} </div>
								<div>{entry.amount} </div>
								<div>{entry.currency} </div>
								<div>{entry.firstname} {entry.lastname}</div>
							</Link>
						</li>
					))}
			</ul>
		</section>
	</section>
	)
}
