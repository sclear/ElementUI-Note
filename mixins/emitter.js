'  Vue Mixins  '

/**
 * @description 从上到下广播触发 name === componentName EventName
 * @param { componentName }  组件name
 * @param { eventName     }  EventName
 * @param { params        }  params
 */
function broadcast(componentName, eventName, params) {
    this.$children.forEach(child => {
        var name = child.$options.componentName;
        // 当递归到目标节点依然会持续执行, data添加isFlag, && isFlag
        if (name === componentName) {
            child.$emit.apply(child, [eventName].concat(params));
        } else {
            broadcast.apply(child, [componentName, eventName].concat([params]));
        }
    });
}
export default {
    methods: {
        /**
         * @description 从下之上触发 name === componentName EventName
         * @param {*} componentName 
         * @param {*} eventName 
         * @param {*} params 
         */
        dispatch(componentName, eventName, params) {
            var parent = this.$parent || this.$root;
            var name = parent.$options.componentName;

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.componentName;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        },
        broadcast(componentName, eventName, params) {
            broadcast.call(this, componentName, eventName, params);
        }
    }
};
