import {ProskommaRenderFromJson, transforms} from 'proskomma-json-tools';

export const perf2usfm = (perf) => {
    const renderer = new ProskommaRenderFromJson({srcJson: perf, actions: transforms.toUsfmActions});
    const output = {};
    renderer.renderDocument({docId: "", config: {}, output});
    return output.usfm;
}
