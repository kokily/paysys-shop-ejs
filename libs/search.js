const createSearch = (queries) => {
	let findPost = {};
	let highlight = {};

	if (queries.searchType && queries.searchText && queries.searchText.length >= 3) {
		let searchTypes = queries.searchType.toLowerCase().split(',');
		let postQueries = [];

		if (searchTypes.indexOf("productName") >= 0) {
			postQueries.push({
				productName: {
					$regex: new RegExp(queries.searchText, "i")
				}
			});
			highlight.productName = queries.searchText;
		}

		if (postQueries.length > 0) findPost = { $or: postQueries };
	}

	return {
		searchType: queries.searchType,
		searchText: queries.searchText,
		findPost,
		highlight
	};
};

export default createSearch;