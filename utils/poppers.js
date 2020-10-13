
function getStyle(element, attrs = [], toNumber = true) {
    const styleInfo = {}
    if (element.currentStyle) {
        attrs.forEach(attr => {
            if (toNumber) styleInfo[attr] = element.currentStyle[attr].replace(/px/, '')
            else styleInfo[attr] = element.currentStyle[attr]
        })
    } else {
        attrs.forEach(attr => {
            if (toNumber) styleInfo[attr] = Number(document.defaultView.getComputedStyle(element, null)[attr].replace(/px/g, ''))
            else styleInfo[attr] = document.defaultView.getComputedStyle(element, null)[attr]
        })
    }
    return styleInfo
}

function getElementHeight(child, element = document.querySelector('.thrid')) {
    console.log(child)
    console.log(element)
    // let child = document.querySelector(target);
    let __scrollTop__,
      offsetParents = [];
    let pointer = child.offsetParent;
    while (
      pointer &&
      element !== pointer &&
      element.contains(pointer)
    ) {
      offsetParents.push(pointer);
      pointer = pointer.offsetParent;
    }
    __scrollTop__ =
      child.offsetTop +
      offsetParents.reduce((pre, curr) => pre + curr.offsetTop, 0);
    console.log(offsetParents)
    console.log(__scrollTop__)
    return __scrollTop__;
  }

function getOffsetParent(element) {
    // NOTE: 1 DOM access here
    var offsetParent = element.offsetParent;
    return offsetParent === document.body || !offsetParent ? document.documentElement : offsetParent;
}
function throttle(fn, wait = 50) {
    let timer = null;
    return function () {
        const context = this;
        const args = arguments;
        if (!timer) {
            timer = setTimeout(function () {
                fn.apply(context, args);
                timer = null;
            }, wait)
        }
    }
}

function getScrollParent(element, cb) {
    var parent = element.parentNode;
    if (!parent || parent === document.documentElement) {
        cb && cb(document.documentElement);
        return document.documentElement;
    }
    if (parent.scrollTop || parent.scrollLeft) {
        cb && cb(parent);
        return parent;
    }
    if (
        ['scroll', 'auto'].indexOf(getStyle(parent, ['overflow'], false)['overflow']) !== -1 ||
        ['scroll', 'auto'].indexOf(getStyle(parent, ['overflow-x'], false)['overflow-x']) !== -1 ||
        ['scroll', 'auto'].indexOf(getStyle(parent, ['overflow-y'], false)['overflow-y']) !== -1
    ) {
        cb && cb(parent);
        return parent;
    }
    return getScrollParent(element.parentNode, cb);
}

const stop = e => { e.stopPropagation() }

/** 
 * @param { DEFAULT_OPTIONS }
 *        { palcement } 初始化定位方向
 *        { position  } 定位方式
 *        { eventsEnabled } 设置监听器
 *        { removeOnDestory } 调用Destory是否删除poper
 * @param { Boolean } [isOpen- popper状态]
 * @param { Object  } [option- popper配置项]
 * @param { Element } [refernceElement- 锁定目标]
 * @param { Element } [popper- popper]
 * @param { Boolean } [useByTooltip- 事件占用]
 * @param { Element } [root- scroll container, bind event]
 */
class popper {
    constructor(refernceElement, popperElement, option) {
        const DEFAULT_OPTIONS = {
            placement: 'top',
            position: 'absolute',
            eventsEnabled: true,
            removeOnDestory: true,
            onCreate: null,
            trigger: 'click',
            appendToBody: true,
            popperPadding: 20
        }
        this.isOpen = false
        this.option = Object.assign({}, DEFAULT_OPTIONS, option)
        this.refernceElement = refernceElement
        this.popperElement = popperElement
        this.popper = null
        this.arrow = null
        this.useByTooltip = false
        this.screenHeight = this.getScreenHeight()
        this.root = getScrollParent(this.refernceElement)
        this.parentScrollList = []
        getScrollParent(this.root, wrap=> {
            this.root !== wrap && this.parentScrollList.push(wrap)
        })
        console.log(this.parentScrollList)
        this.bindTriggerEventListener()
    }
    // bind Scroll触发
    bindEventListener() {
        this.popper.addEventListener('click', stop, false)
        if (this.option.eventsEnabled) {
            this.root.addEventListener('scroll', throttle(() => {
                this.update()
                getElementHeight(this.refernceElement)
            }) , false)
        }
    }
    // 设置scroll监听器
    bindTriggerEventListener() {
        const directEvents = []
        const oppositeEvents = []
        this.option.trigger.split(' ').forEach(event => {
            switch (event) {
                case 'hover':
                    directEvents.push('mouseenter')
                    oppositeEvents.push('mouseleave')
                    break;
                case 'focus':
                    directEvents.push('focus')
                    oppositeEvents.push('bulr')
                    break;
                case 'click':
                    directEvents.push('click')
                    oppositeEvents.push('click')
                    break;
                default:
                    break;
            }
        })
        oppositeEvents.forEach(event => {
            this.refernceElement.addEventListener(event, this.handlePopper.bind(this), false)
        })
        directEvents.forEach(event => {
            this.refernceElement.addEventListener(event, this.handlePopper.bind(this), false)
        })
    }
    // bindEvent管理事件的出现与隐藏(处理相同事件占用)
    handlePopper() {
        if (!this.useByTooltip) {
            this.useByTooltip = true
            setTimeout(() => {
                if (this.isOpen) {
                    this.Destory()
                }
                else this.createPopper()
                this.useByTooltip = false
            }, 4)
        }
    }
    // 构建popper
    createPopper() {
        this.isOpen = true
        const popper = document.createElement('div')
        const arrow = document.createElement('div')
        popper.className = 'popper'
        arrow.className = 'popper__arrow'
        popper.style.position = this.option.position
        if (typeof this.popperElement === 'string') {
            popper.innerHTML = this.popperElement
        }
        else popper.appendChild(this.popperElement)
        popper.appendChild(arrow)
        if (this.option.appendToBody) document.body.appendChild(popper)
        else {
            this.refernceElement.appendChild(popper)
            this.refernceElement.style.position = 'relative'
        }

        this.popper = popper
        this.arrow = arrow
        this.bindEventListener()
        this.update()
    }
    // 更新popper位置
    update() {
        const xy = this.calcPopper()
        this.popper.style.left = `${xy.x}px`
        this.popper.style.top = `${xy.y}px`
        this.option.placement = xy.place
        this.arrow.style.left = `${xy.arrow__x}px`
        this.arrow.style.top = `${xy.arrow__y}px`
        this.arrow.style.transform = `rotate(${xy.rotate}deg)`
    }
    // 读取refernce位置
    refernceXY() {
        let { left, right, top, bottom, width, height } = this.refernceElement.getBoundingClientRect()
        return {
            left,
            right,
            top,
            bottom,
            width,
            height
        }
    }
    getScreenHeight() {
        return document.documentElement.clientHeight || document.body.clientHeight
    }
    // 计算Popper当前的位置
    calcPopper() {
        // 锁定项位置
        let { left, right, top, bottom, width, height } = this.refernceXY()
        let nTop = top
        // popper位置
        let popper = getStyle(this.popper, ['width', 'height', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'])
        let popperWidth = popper.width + popper.paddingLeft + popper.paddingRight
        let popperHeight = popper.height + popper.paddingTop + popper.paddingBottom
        // let tops = this.parentScrollList.reduce((pre, next)=> pre + next.scrollTop, 0)
        let tops = this.parentScrollList.reduce((pre, next)=> pre + next.scrollTop, 0)
        // console.log(this.parentScrollList[0].scrollTop)
        // console.log(tops)
        if (!this.option.appendToBody) {
            left = right = top = bottom = tops = 0
        }
        const handleEvent = {
            left: ()=> {
                return {
                    x: left - popperWidth - this.option.popperPadding,
                    y: height / 2 + top - popperHeight / 2
                }
            },
            leftStart: ()=> {
                return {
                    x: left - popperWidth - this.option.popperPadding,
                    y: top
                }
            },
            leftEnd: ()=> {
                return {
                    x: left - popperWidth - this.option.popperPadding,
                    y: top - (popperHeight - height)
                }
            },
            right: () => {
                return {
                    x: (this.option.appendToBody ? right : width) + this.option.popperPadding,
                    y: height / 2 + top - popperHeight / 2
                }
            },
            rightStart: () => {
                return {
                    x: (this.option.appendToBody ? right : width) + this.option.popperPadding,
                    y: top
                }
            },
            rightEnd: () => {
                return {
                    x: (this.option.appendToBody ? right : width) + this.option.popperPadding,
                    y: top - (popperHeight - height)
                }
            },
            top: ()=> {
                return {
                    x: left - (popperWidth - width) / 2,
                    y: top - popperHeight - this.option.popperPadding + tops,
                    place: nTop - popperHeight - this.option.popperPadding*2 < 0 ? 'bottom' : 'top',
                    arrow__x: (popperWidth - width)/2 + width*0.3,
                    arrow__y: popperHeight - 2,
                    rotate: 180
                }
            },
            topStart: ()=> {
                return {
                    x: left,
                    y: top - popperHeight - this.option.popperPadding,
                    place: nTop - popperHeight - this.option.popperPadding*2 < 0 ? 'bottomStart' : 'topStart',
                    arrow__x: (popperWidth - width)/2 + width*0.3,
                    arrow__y: popperHeight - 2,
                    rotate: 180
                }
            },
            topEnd: ()=> {
                return {
                    x: left - (popperWidth - width),
                    y: top - popperHeight - this.option.popperPadding
                }
            },
            bottom: ()=> {
                return {
                    x: left - (popperWidth - width) / 2,
                    y: top + height + this.option.popperPadding + tops,
                    place: nTop + height + popperHeight + this.option.popperPadding*2 > this.screenHeight ? 'top' : 'bottom',
                    arrow__x: (popperWidth - width)/2 + width*0.3,
                    arrow__y: -6,
                    rotate: 0
                }
            },
            bottomStart: ()=> {
                return {
                    x: left,
                    y: top + height + this.option.popperPadding
                }
            },
            bottomEnd: ()=> {
                return {
                    x: left - (popperWidth - width),
                    y: top + height + this.option.popperPadding
                }
            },
        }
        return handleEvent[this.option.placement]()
    }
    Destory() {
        this.isOpen = false
        this.popper && (this.popper.parentNode.removeChild(this.popper), this.popper = null)
        if (this.option.eventsEnabled) {
            this.root.removeEventListener('scroll', () => { })
        }
    }
}