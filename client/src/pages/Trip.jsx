import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function Trip() {
	const [trip, setTrip] = useState([]);
	const { id } = useParams();
	const [display, setDisplay] = useState({
		currency: "",
		transactions: {},
		total: null,
	});

	useEffect(() => {
		getTrip();
		displayCurrency();
	}, [id]);

	const getTrip = () => {
		fetch(`/api/transactions/trip/${id}`, 
		{headers: {
		authorization: "Bearer " + localStorage.getItem("token"),
		  }})
			.then(response => response.json())
			.then(trip => {
				console.log(trip);
				setTrip(trip);
			})
			.catch(error => {
				console.log(error);
			});
	};

	const displayCurrency = () => {
		fetch(`/api/transactions/trip/${id}`, 
		{headers: {
		authorization: "Bearer " + localStorage.getItem("token"),
		  }})
			.then(response => response.json())
			.then(transactionsByCurrency => {
				const displayData = {};
				const total = {};
				const participants = {};

				transactionsByCurrency.forEach(transaction => {
					if(!displayData[transaction.currency]) {
						displayData[transaction.currency] = [];
						total[transaction.currency] = 0;
					}
					displayData[transaction.currency].push(transaction);
					total[transaction.currency] += transaction.amount;

					// the following makes participants only people who has collaborated in the first payment list
					participants[transaction.user_id] = {
						firstname: transaction.firstname,
						lastname: transaction.lastname
					};
				});

				const allParticipants = Object.keys(participants).length;
				const individualShare = {};
				const netAmounts = {};

				for (const currency in total) {
					individualShare[currency] = total[currency] / allParticipants;
					netAmounts[currency] = {};
				
					for (const userId in participants) {
						netAmounts[currency][userId] = individualShare[currency];
					}
				}

				transactionsByCurrency.forEach(transaction => {
					const userId = transaction.user_id;
					const currency = transaction.currency;
					netAmounts[currency][userId] -= transaction.amount;
				});

				setDisplay({
					currency: id,
					transactions: displayData,
					total: total,
					participants: participants,
					individualShare: individualShare,
					netAmounts: netAmounts
				});
			})
			.catch(error => {
				console.log(error);
			});
	};

	return (
	<section className="tripPage wrapper">
		<h2>Trip Details</h2>

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
								<div>{entry.date.split("T")[0]}</div>
								<div>{entry.merchant}</div>
								<div>{entry.name}</div>
								<div>{entry.amount.toFixed(2)}</div>
								<div>{entry.currency}</div>
								<div>{entry.firstname} {entry.lastname}</div>
							</Link>
						</li>
					))}
			</ul>
			<div className="currency-grid">
				{Object.keys(display.transactions).map(currency => (
					<div key={currency}>
						<h5>{currency}</h5>
						<ul>
							{display.transactions[currency].map(transaction => (
								<li key={transaction.id}>
									{transaction.merchant} - {transaction.amount.toFixed(2)} {transaction.currency}
								</li>
							))}
						</ul>
						<br />
						<h6>Total: {display.total[currency].toFixed(2)} {currency}</h6>
						<h6>Individual Share: {display.individualShare[currency].toFixed(2)} {currency}
						</h6>
						<br />
						<ul>
							{Object.keys(display.netAmounts[currency]).map(netUserId => {
							const netAmount = display.netAmounts[currency][netUserId];
							if (netAmount !== 0) {
								const creditors = Object.keys(display.netAmounts[currency]).filter(userId => {
								return display.netAmounts[currency][userId] > 0 && userId !== netUserId;
								});

								const debtors = Object.keys(display.netAmounts[currency]).filter(userId => {
									return display.netAmounts[currency][userId] < 0 && userId !== netUserId;
								})

								console.log("net amount:", netAmount);
								console.log("creditors:", creditors);
								console.log("debtors:", debtors);

								return (
								<li key={netUserId}>
									{display.participants[netUserId].firstname} {display.participants[netUserId].lastname}{' '}
									{netAmount < 0 ? (
										<span>
											receives {Math.abs(netAmount).toFixed(2)} {currency} from
										{creditors.length === 1 ? (
											<span>
												{" "}{display.participants[creditors[0]].firstname}
												{" "}{display.participants[creditors[0]].lastname}
											</span>
										) : (
											creditors.map(creditorId => (
											<span key={creditorId}>
												{" "}{display.participants[creditorId].firstname}
												{" "}{display.participants[creditorId].lastname}
												{creditorId !== creditors[creditors.length - 1] && ', '}	
											</span>
										))
									)}
									</span>
									) : ( 
									<span>
										owes {Math.abs(netAmount).toFixed(2)} {currency} to
										{debtors.length === 1 ? (
										<span>
											{" "}{display.participants[debtors[0]].firstname}
											{" "}{display.participants[debtors[0]].lastname}
										</span>
									) : (
										debtors.map(creditorId => (
										<span key={creditorId}>
											{" "}{display.participants[creditorId].firstname}
											{" "}{display.participants[creditorId].lastname}
											{creditorId !== creditors[creditors.length - 1] && ', '}
											</span>
										))
										)}
									</span>
									)}
								</li>
								);
							} else {
								return null;
							}
							})}
						</ul>
					</div>
				))}
			</div>
		</section>
	</section>
	)
}
