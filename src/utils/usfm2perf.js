/* package.json dependencies for the two code samples below:
    "proskomma": "0.7.16",
    "uw-proskomma": "0.8.5",
*/


import {Proskomma} from 'proskomma'

export const usfm2perf = (usfm) => {
    const pk = new UWProskomma();
    pk.importDocuments(
        {org: "xxx", lang: 'xxx', abbr: 'XXX'}, // doesn't matter...
        'usfm', 
        [usfm]
    );
    const perfResultDocument = pk.gqlQuerySync(
        '{documents {id docSetId perf} }')
        .data.documents[0];
    const perf = JSON.parse(perfResultDocument.perf);
    return perf;
}



/*
import {UWProskomma} from 'uw-proskomma'

export const usfm2perf = (usfm) => {
    const pk = new UWProskomma();
    console.log("usfm2perf() usfm:", usfm)
    pk.importDocuments(
        {org: "xxx", lang: 'xxx', abbr: 'XXX'}, // doesn't matter...
        'usfm', 
        [usfm],
    );
    const perfResultDocument = pk.gqlQuerySync(
        '{documents {id docSetId perf} }')
        .data.documents[0];
    const perf = JSON.parse(perfResultDocument.perf);
    return perf;
}
*/
