import { useState, useEffect } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SearchParams from "../components/SearchParams";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			cacheTime: Infinity,
		},
	},
});

export default function Transactions() {
	const [transactions, setTransactions] = useState({
		user: {},
		transaction: []
	});
	const username = localStorage.getItem("username");

	useEffect(() => {
		getTransactions()
	}, []);

	const getTransactions = () => {
		fetch(`/api/transactions/user/${username}`, 
		{headers: {
		authorization: "Bearer " + localStorage.getItem("token"),
		}})
		.then(response => response.json())
		.then(transaction => {
			console.log(transaction);
			setTransactions(transaction);
		})
		.catch(error => {
			console.log(error);
		});
	};

	return (
		<QueryClientProvider client={queryClient}>
		<section className="transactionsPage wrapper">
			<header>
				<div>
					<h2>Transactions</h2>
				</div>
				<button>New Transaction</button>
			</header>

			<section>
			<SearchParams setResults={setTransactions}/>
			</section>

			<section className="transactionsList">
				<div className="transactionsHeader">
					<div><a href="#"></a>DATE</div>
					<div><a href="#"></a>MERCHANT</div>
					<div><a href="#"></a>CATEGORY</div>
					<div><a href="#"></a>AMOUNT</div>
					<div><a href="#"></a>CURRENCY</div>
				</div>
				<ul className="transactionContent">
					{transactions.transaction.map(entry => (
						<li key ={entry.id}>
							<Link className="transactionRow" to={`/transactions/${entry.id}`}>
								<div>{entry.date.split("T")[0]} </div>
								<div>{entry.merchant} </div>
								<div>{entry.name} </div>
								<div>{entry.amount.toFixed(2)} </div>
								<div>{entry.currency} </div>
							</Link>
						</li>
					))}
				</ul>
			</section>
			<section>
			<Outlet />
			</section>
			<div id="addNewOverlay">
				<div className="popUp">
					<div className="topBar"></div>
					<div className="addContent"></div>
					<div className="footerBar"></div>
				</div>
			</div>
		</section>

		</QueryClientProvider>
	)
}
