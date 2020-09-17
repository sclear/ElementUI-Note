
/**
 * 将选中项暴露可视区
 * @param { container }  容器
 * @param { selected  }  选中项
 */
function scrollIntoView(container, selected) {
  if (Vue.prototype.$isServer) return;
  
  // 目标不存在
  if (!selected) {
    container.scrollTop = 0;
    return;
  }

  // offsetParent组
  const offsetParents = [];
  let pointer = selected.offsetParent;
  // 从目标节点向上遍历直到容器范围
  while (pointer && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer);
    pointer = pointer.offsetParent;
  }
  const top = selected.offsetTop + offsetParents.reduce((prev, curr) => (prev + curr.offsetTop), 0);
  const bottom = top + selected.offsetHeight;
  const viewRectTop = container.scrollTop;
  const viewRectBottom = viewRectTop + container.clientHeight;

  if (top < viewRectTop) {
    container.scrollTop = top;
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight;
  }
}

//   // 存在  当前 ！== 目标   所属关系
//   while (pointer && container !== pointer && container.contains(pointer)) {
//     offsetParents.push(pointer);
//     pointer = pointer.offsetParent;
//   }
//   // 目标所处top值
//   const top = selected.offsetTop + offsetParents.reduce((prev, curr) => (prev + curr.offsetTop), 0);
//   // 当前底部位于容器顶部临界点
//   const bottom = top + selected.offsetHeight;
//   const viewRectTop = container.scrollTop;
//   const viewRectBottom = viewRectTop + container.clientHeight;

//   if (top < viewRectTop) {
//     container.scrollTop = top;
//   } else if (bottom > viewRectBottom) {
//     container.scrollTop = bottom - container.clientHeight;
//   }
