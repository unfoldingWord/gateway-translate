import {Proskomma} from 'proskomma'

export const usfm2perf = (usfm) => {
    let perf;
    try {
        const pk = new Proskomma();
        pk.importDocuments(
            {lang: 'xxx', abbr: 'XXX'}, // doesn't matter...
            'usfm', 
            [usfm]
        );
        const perfResultDocument = pk.gqlQuerySync(
            '{documents {id docSetId perf} }')
            .data.documents[0];
        perf = JSON.parse(perfResultDocument.perf);
    } catch (e) {
        perf = null
    }
    return perf;
}
