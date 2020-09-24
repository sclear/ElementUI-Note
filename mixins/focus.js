/**
 * Select Input ...  聚焦Mixins
 * @param { refName }  
 */

export default function (ref) {
    return {
        methods: {
            focus() {
                this.$refs[ref].focus();
            }
        }
    };
};
