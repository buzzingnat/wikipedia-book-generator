export async function fetchSearchResults(searchTerm: string) {
    let url = "https://en.wikipedia.org/w/api.php";

    const cleanedSearchTerm: string = searchTerm.trim().replace(' ', '20%');
    const params = {
        action: "query",
        list: "search",
        srsearch: cleanedSearchTerm,
        format: "json",
        srprop: "snippet",
        prop: "extracts",
        exintro: "true",
        explaintext: "true",
        redirects: "1",
    };

    url = url + "?origin=*";

    Object.entries(params).forEach(function(pair: [string, string]) {
      const key = pair[0];
      const value = pair[1];
      url += "&" + key + "=" + value;
    });

    return await fetch(url)
        .then(function(response){
          return response.json();
        })
        .then(function(response) {
            return response;
        })
        .catch(function(error){
          console.error(error);
          return error;
        });
}

export async function getArticleSummaryText(pageId: string) {
    let url = "https://en.wikipedia.org/w/api.php";

    // https://en.wikipedia.org/w/api.php?format=json&action=query
    // &prop=extracts&exintro&explaintext&redirects=1&titles=Apple|Orange
    // https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=Frequency|Cat_breeds|Domestication
    const params = {
        action: "query",
        format: "json",
        prop: "extracts",
        exintro: "true",
        explaintext: "true",
        redirects: "1",
        pageids: pageId,
    };

    url = url + "?origin=*";

    Object.entries(params).forEach(function(pair: [string, string]) {
      const key: string = pair[0];
      const value: string = pair[1];
      url += "&" + key + "=" + value;
    });

    return await fetch(url)
        .then(function(response){
          return response.json();
        })
        .then(function(response) {
            return response;
        })
        .catch(function(error){
          console.error(error);
          return error;
        });
}

export async function getArticleSummaryTextByTitle(titles: string, continueValues: string) {
    let url = "https://en.wikipedia.org/w/api.php";

    // https://en.wikipedia.org/w/api.php?format=json&action=query
    // &prop=extracts&exintro&explaintext&redirects=1&titles=Apple|Orange
// https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=Farm_cat|Cat_breeds
    const params = {
        action: "query",
        format: "json",
        prop: "extracts",
        exintro: "true",
        explaintext: "true",
        redirects: "true",
        titles,
    };

    url = url + "?origin=*";

    Object.entries(params).forEach(function(pair: [string, string]) {
      const key: string = pair[0];
      const value: string = pair[1];
      url += "&" + key + "=" + value;
    });

    if (continueValues) {
        url += continueValues;
    }

    return await fetch(url)
        .then(function(response){
          return response.json();
        })
        .then(function(response) {
            return response;
        })
        .catch(function(error){
          console.error(error);
          return error;
        });
}

export async function getArticleResults(pageId: string) {
    let url = "https://en.wikipedia.org/w/api.php";

    // https://en.wikipedia.org/w/api.php?action=parse&format=json&pageid=18978754
    // &section=0&prop=links|text|displaytitle|subtitle|images|sections

    const params = {
        action: "parse",
        format: "json",
        pageid: pageId,
        section: '0',
        prop: 'links|text|displaytitle|subtitle|images|sections',
    };

    url = url + "?origin=*";

    Object.entries(params).forEach(function(pair: [string, string]) {
      const key: string = pair[0];
      const value: string = pair[1];
      url += "&" + key + "=" + value;
    });

    return await fetch(url)
        .then(function(response){
          return response.json();
        })
        .then(function(response) {
            return response;
        })
        .catch(function(error){
          console.error(error);
          return error;
        });
}
