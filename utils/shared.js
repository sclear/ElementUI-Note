/**
 * @description 判定值 !null && !undefined
 */
function isDef(val) {
    return val !== undefined && val !== null;
}

/**
 * 
 * @description 判定字段含南北朝鲜字符
 */
function isKorean(text) {
    const reg = /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi;
    return reg.test(text);
}
