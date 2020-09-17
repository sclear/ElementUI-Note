/**
 * @description 计算scrollBar宽度
 */

 
function calcScrollBarWidth() {
  let scrollBarWidth
  if (scrollBarWidth !== undefined) return scrollBarWidth;

  /**
   * create ParentDom for parentWidth - childWidth
   */
  const outer = document.createElement('div');
  outer.className = 'el-scrollbar__wrap';
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  /**
   * create ChildDom
   */
  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  /**
   * parentDomWidth - childDomWidth === scrollBarWidth
   */
  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;

  return scrollBarWidth;
};
