import { useState, useEffect } from "react";
// import Results from "./Results";

const CATEGORIES = ["food", "transport", "acomodation", "groceries", "shoping", "gifts", "personal care", "activities", "other"];

const SearchParams = ({setResults}) => {
	const [category, setCategory] = useState("");

	useEffect(() => {
		getTransactions();
	}, []);

	const getTransactions = () => {
		fetch(`/api/transactions/category/${category}`)
			.then(response => response.json())
			.then(transactions => {
				setResults(transactions);
			})
			.catch(error => {
				console.log(error);
			}
		);
	}

	return (
		<div className="search-params">
			<form onSubmit={e => {
				e.preventDefault();
				getTransactions();
			}}>
					<select
						id="category"
						value={category}
						onChange={(e) => {
							setCategory(e.target.value);
						}}
					>
						<option value="">--Please select a category--</option>
						{CATEGORIES.map((category) => (
							<option 
								key={category}
								value={category}>
							{category}
							</option>
						))}
					</select>
				<button>Submit</button>
			</form>
		</div>
	);
};

export default SearchParams;
