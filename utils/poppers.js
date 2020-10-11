
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

function getScrollParent(element) {
    var parent = element.parentNode;
    if (!parent || parent === document.body.parentNode) {
        return window;
    }
    if (parent.scrollTop || parent.scrollLeft) {
        return parent;
    }
    if (
        ['scroll', 'auto'].indexOf(getStyle(parent, ['overflow'], false)['overflow']) !== -1 ||
        ['scroll', 'auto'].indexOf(getStyle(parent, ['overflow-x'], false)['overflow-x']) !== -1 ||
        ['scroll', 'auto'].indexOf(getStyle(parent, ['overflow-y'], false)['overflow-y']) !== -1
    ) {
        return parent;
    }
    return getScrollParent(element.parentNode);
}

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
            appendToBody: false,
        }
        this.isOpen = false
        this.option = Object.assign({}, DEFAULT_OPTIONS, option)
        this.refernceElement = refernceElement
        this.popperElement = popperElement
        this.popper = null
        this.useByTooltip = false
        this.root = getScrollParent(this.refernceElement)
        this.bindTriggerEventListener()
    }
    // 
    bindEventListener() {
        if (this.option.eventsEnabled) {
            this.root.addEventListener('scroll', () => {
                this.update()
            }, false)
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
            console.log(this.handlePopper.bind)
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
        if(this.option.appendToBody) document.body.appendChild(popper)
        else {
            this.refernceElement.appendChild(popper)
            this.refernceElement.style.position = 'relative'
        }
        
        this.popper = popper
        this.bindEventListener()
        this.update()
    }
    // 更新popper位置
    update() {
        console.log('122')
        const xy = this.calcPopper()
        this.popper.style.left = `${xy.x}px`
        this.popper.style.top = `${xy.y}px`
        this.option.placement = xy.place
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
    // 计算Popper当前的位置
    calcPopper() {
        // 锁定项位置
        let { left, right, top, bottom, width, height } = this.refernceXY()
        if(!this.option.appendToBody) {
            left = right = top = bottom = 0
        }
        // popper位置
        let popper = getStyle(this.popper, ['width', 'height', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'])
        let popperWidth = popper.width + popper.paddingLeft + popper.paddingRight
        let popperHeight = popper.height + popper.paddingTop + popper.paddingBottom
        const handleEvent = {
            left() {
                return {
                    x: left - popperWidth,
                    y: height / 2 + top - popperHeight / 2
                }
            },
            leftStart() {
                return {
                    x: left - popperWidth,
                    y: top
                }
            },
            leftEnd() {
                return {
                    x: left - popperWidth,
                    y: top - (popperHeight - height)
                }
            },
            right: ()=> {
                return {
                    x: this.option.appendToBody ? right : width,
                    // x: right,
                    y: height / 2 + top - popperHeight / 2
                }
            },
            rightStart: ()=> {
                return {
                    x: this.option.appendToBody ? right : width,
                    y: top
                }
            },
            rightEnd: ()=> {
                return {
                    x: this.option.appendToBody ? right : width,
                    y: top - (popperHeight - height)
                }
            },
            top() {
                return {
                    x: left - (popperWidth - width) / 2,
                    y: top - popperHeight,
                    place: top - popperHeight < 0 ? 'bottom' : 'top'
                }
            },
            topStart() {
                return {
                    x: left,
                    y: top - popperHeight
                }
            },
            topEnd() {
                return {
                    x: left - (popperWidth - width),
                    y: top - popperHeight
                }
            },
            bottom() {
                return {
                    x: left - (popperWidth - width) / 2,
                    y: top + height,
                    place: top - popperHeight < 0 ? 'bottom' : 'top'
                }
            },
            bottomStart() {
                return {
                    x: left,
                    y: top + height
                }
            },
            bottomEnd() {
                return {
                    x: left - (popperWidth - width),
                    y: top + height
                }
            },
        }
        return handleEvent[this.option.placement]()
    }
    Destory() {
        this.isOpen = false
        this.popper && (this.popper.parentNode.removeChild(this.popper), this.popper = null)
        if (this.option.eventsEnabled) {
            this.root.removeEventListener('scroll', ()=> {})
        }
    }
}