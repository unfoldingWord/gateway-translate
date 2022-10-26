import {PerfRenderFromJson, transforms} from 'proskomma-json-tools';

export const perf2usfm = (perf) => {
    const renderer = new PerfRenderFromJson({srcJson: perf, actions: transforms.toUsfmActions});
    const output = {};
    renderer.renderDocument1({docId: "", config: {}, output});
    return output.usfm;
}


/*

const cl = new PerfRenderFromJson({srcJson: perf, actions: toUsfmActions});
const output = {};
cl.renderDocument({docId: "", config: {}, output});

*/
