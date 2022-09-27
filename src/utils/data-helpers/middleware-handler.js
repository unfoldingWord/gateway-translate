import React, { useEffect } from 'react';
import perf2html from "./perf2html"
import html2perf from "./html2perf"

export default function DcsHandler({
}) {
}

const proskomma = new UWProskomma();
// const succinctJson = fse.readJsonSync(path.resolve(path.join(__dirname, "..", "test_data", "fra_lsg_succinct.json")));
const succinctJson = fse.readJsonSync(path.resolve(path.join(__dirname, "..", "test_data", "eng_engWEBBE_succinct.json")));
proskomma.loadSuccinctDocSet(succinctJson);

const alignedPerf = fse.readJsonSync(path.resolve(path.join(__dirname, "..", "test_data", "TIT_dcs_eng-alignment_perf_v0.2.1.json")));
const docSetId = "DCS/en_ult";
const epitelete = new Epitelete({docSetId});

const unaligned = await epitelete.sideloadPerf("TIT", alignedPerf, { readPipeline: "stripAlignment" });

console.log(epitelete.history["TIT"].stack[0].pipelineData?.strippedAlignment);

        const sequencesHtml = Object.keys(doc.sequences).reduce((sequences, seqId) => {
            sequences[seqId] = perf2html(doc, seqId, this.htmlMap, bcvFilter);
            return sequences;
        }, {});
        return {
            docSetId: this.docSetId,
            mainSequenceId: doc.main_sequence_id,
            schema: doc.schema,
            metadata: doc.metadata,
            sequencesHtml,
        };
    // const bcvFilterExample = { book: { tit: { ch: { 1: {} } } } }
        return this._outputHtml(await this.readPerf(bookCode, options), bcvFilter);




    async writeHtml(bookCode, sequenceId, perfHtml, options = {}) {
        const { writePipeline, readPipeline } = options;
        const perf = html2perf(perfHtml, sequenceId);
        await this.writePerf(bookCode,sequenceId,perf, {writePipeline});
        return await this.readHtml(bookCode, {readPipeline});
    }

