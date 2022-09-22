import { parse } from "node-html-parser";

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

const getAttributes = (node) => {
  const atts = node.attributes;
  return !atts.length
    ? typeof atts === "object" && atts
    : [...atts].reduce((atts, att) => {
        atts[att.name] = att.value;
        return atts;
      }, {});
};

const camelToKebabCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const kebabDataSet = (target) =>
  Object.keys(target).reduce((dataset, key) => {
    const newKey = camelToKebabCase(key);
    dataset[newKey] = target[key];
    return dataset;
  }, {});

const getDataset = (node) => {
  const dataSet = node.dataset;
  if (dataSet) return kebabDataSet(dataSet);
  const atts = getAttributes(node);
  return (
    atts &&
    Object.keys(atts).reduce((dataset, key) => {
      const data = key.match(/(?<=data-).+/);
      if (data) dataset[data] = atts[key];
      return dataset;
    }, {})
  );
};

const getProps = (node) => {
  const {
    "subtype-ns": subtypeNs,
    subtype: rawSubtype,
    ...dataset
  } = getDataset(node);
  const subtype = {
    subtype: subtypeNs ? `${subtypeNs}:${rawSubtype}` : rawSubtype
  };
  const props =
    dataset &&
    Object.keys(dataset).reduce((props, key) => {
      const att = key.match(/(?<=atts-).+/);
      if (att) {
        if (!props.atts) props.atts = {};
        props.atts[att] = dataset[key];
      } else props[key] = dataset[key];
      return props;
    }, {});
  return {
    ...props,
    ...subtype
  };
};

const getContentFrom = (contentNode) => {
  let content = [];
  for (const node of contentNode.childNodes) {
    if (node.nodeType === TEXT_NODE) {
      content.push(node.textContent);
      continue;
    }
    if (node.getAttribute("class") === "meta-content") continue;
    content.push(getBlock(node));
  }
  return content;
}

const blockFrom = (node) => {
  if (node.hasAttribute("data-atts-number")) return {};
  const metaContent = node.querySelector(":scope > .meta-content");
  return {
    content: getContentFrom(node) || [],
    ...(metaContent && { meta_content: getContentFrom(metaContent) || [] })
  };
};

const getBlock = (node) => {
  const props = getProps(node);
  const defaultContent = ["paragraph"].includes(props.type) && { content: [] };
  return {
    ...props,
    ...(node.childNodes.length ? blockFrom(node) : defaultContent)
  };
};

const browserGetBlocks = (nodes) => Array.from(nodes, (node) => getBlock(node));

const nodeJsGetBlocks = (nodes) =>
  nodes.reduce((blocksList, node) => {
    if (node.nodeType !== ELEMENT_NODE) return blocksList;
    blocksList.push(getBlock(node));
    return blocksList;
  }, []);

const getBlocksFrom = (containerNode) =>
  typeof containerNode.children === "object"
    ? browserGetBlocks(containerNode.children)
    : nodeJsGetBlocks(containerNode.childNodes);

const parseHtml = (html) =>
  typeof DOMParser === "function"
    ? new DOMParser().parseFromString(html, "text/html")
    : parse(html);

function html2perf(perfHtml, sequenceId) {
  const sequencesHtml = parseHtml(perfHtml.sequencesHtml[sequenceId]);
  const sequenceElement = sequencesHtml.getElementById(sequenceId);
  const props = getDataset(sequenceElement);

  return {
    ...props,
    blocks: getBlocksFrom(sequenceElement)
  };
}

export default html2perf;
