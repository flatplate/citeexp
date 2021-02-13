const crossrefAPIUrl = "https://api.crossref.org/works/";

export function doiMetadata(doi) {
    const queryUrl = crossrefAPIUrl + encodeURIComponent(doi);
    return fetch(queryUrl).then(data => data.json()).then(json => json.message);
}