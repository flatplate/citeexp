const outgoingCitationsEndpoint =
    "https://opencitations.net/index/coci/api/v1/references/";
const incomingCitationsEndpoint =
    "https://opencitations.net/index/coci/api/v1/citations/";

export function getOutgoingCitations(doi) {
    let doiUrlPart = encodeURIComponent(doi);
    return fetch(outgoingCitationsEndpoint + doiUrlPart).then((data) => data.json());
}

export function getIncomingCitations(doi) {
    let doiUrlPart = encodeURIComponent(doi);
    return fetch(incomingCitationsEndpoint + doiUrlPart).then((data) => data.json());
}
