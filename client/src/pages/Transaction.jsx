import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Transaction() {
	const [transaction, setTransaction] = useState([]);
	const { id } = useParams();

	useEffect(() => {
		getTransaction();
	}, [id]);

	const getTransaction = () => {
		fetch(`/api/transactions/${id}`, 
		{headers: {
		authorization: "Bearer " + localStorage.getItem("token"),
		  }})
			.then(response => response.json())
			.then(transaction => {
				setTransaction(...transaction);
			})
			.catch(error => {
				console.log(error);
		});
	}
	return (
	<section>
		<header>
			<h2>Transaction Details</h2>
		</header>
		<div>
			<p>Category: {transaction.name} - {/* this needs to get displayed */}
				Merchant: {transaction.merchant} -
				Amount: {transaction.amount} - {/* this needs to show two decimals */}
				Currency: {transaction.currency} -
				Details: {transaction.description}
			</p>
		</div>
	</section>
	)
}
