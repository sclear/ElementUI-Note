/**
 * @description 判定node是否是ELEMENT_NODE
 *              nodeType     Name
 *                  1       ELEMENT_NODE
 *                  2       ATTRIBUTE_NODE
 *                  3       TEXT_NODE
 *                  ....
 */
function isHtmlElement(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
}

/**
 * 
 * @description 判定 void 0, Undefined
 */
const isUndefined = (val) => {
    return val === void 0;
};