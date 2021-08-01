// A mock function to mimic making an async request for data
export function fetchCount(amount = 1) {
  return new Promise<{ data: number }>((resolve) =>
    setTimeout(() => resolve({ data: amount }), 500)
  );
}

export async function fetchSearchResults(searchTerm: string) {
    let url = "https://en.wikipedia.org/w/api.php";

    const cleanedSearchTerm = searchTerm.trim().replace(' ', '20%');

    const params = {
        action: "query",
        list: "search",
        srsearch: cleanedSearchTerm,
        format: "json",
        srprop: "snippet",
    };

    url = url + "?origin=*";

    Object.entries(params).forEach(function(pair: [string, string]) {
      const key = pair[0];
      const value = pair[1];
      url += "&" + key + "=" + value;
    });

    console.log('built url', url);

    return await fetch(url)
        .then(function(response){
          console.log('raw response', {response});
          return response.json();
        })
        .then(function(response) {
            console.log('formatted response', {response});
            if (response.query.search[0].title === searchTerm){
                console.log(
                    `Your search page '${searchTerm}'`
                    + ` exists on English Wikipedia`
                );
            }
            return response;
        })
        .catch(function(error){
          console.log(error);
          return error;
        });
}
