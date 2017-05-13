<template>
    <div :id="wrapperProp.id" :class="wrapperProp.class">
        {{comCollection}}
        <input type="text" :placeholder="$slots.default[0].text" :class="inputProp.class" :id="inputProp.id" v-model="inputVal" :name="inputProp.name">
    </div>
</template>

<script>
    export default {
        props: {
            inputProp: {
                required: true
            },
            wrapperProp: {
                required: true
            },
            xhrOptions: {
                required: true,
            },
            searchKey: {
                required: true,
                type: String
            },
            emitToWindowFunc: {
                required: false,
                default: false,
                type: Boolean
            },
            turkishCharSupport: {
                required: false,
                default: true
            }
        },
        watch: {
            inputVal(newVal) {
                var text = newVal;
                this.changedInput(text);
            }
        },
        data() {
            return {
                collection: [],
                inputVal: '',
                gate: true,
                loading: false,
            }
        },
        computed: {
            comCollection() {
                if (this.gate === false && this.collection.length > 0 && this.loading === false) {
                    this.searchInCollection();
                } else if (this.loading === true) {
                    this.eventEmitter([], 'loading');
                } else {
                    this.eventEmitter([], 'not ready');
                }
                return;
            }
        },
        methods: {
            // Params: (value: string) => input dom target value
            changedInput(value) {
                if(value.trim().length >= 3 && this.gate === true) {
                    this.gate = false;
                    this.sendXhrRequest();
                } else if (value.trim().length < 3 && this.gate === false) {
                    this.collection = [];
                    this.gate = true;
                }
            },

            sendXhrRequest() {
                var me  = this;
                var url = this.xhrOptions.url + '?' + this.xhrOptions.query + '=' + me.inputVal.substr(0, 3)
                this.loading = true;
                window.axios.get(url).then(response => {
                    if (response.data instanceof Array) {
                        me.collection.push(...response.data);
                    } else if (response.data instanceof Object) {
                        me.collection.push(response.data);
                    }
                    this.loading = false;
                })
            },

            searchInCollection() {
                var result = this.collection.filter(item => {
                    var str = item[this.searchKey];
                    var input = this.inputVal;
                    if (this.turkishCharSupport === true) {
                        input = input.replace('I', 'ı').replace('İ', 'i');
                    }
                    input = input.toLowerCase();

                    var patt = new RegExp(input, "i");
                    console.log('search: ' + input + ' && db: ' + str)
                    return patt.test(str);
                })
                if (result.length > 0) {
                    this.eventEmitter(result, 'ready')
                } else {
                    this.eventEmitter(result, 'no data')
                }
            },

            // Params: (data: object || array, status: string)
            eventEmitter(data, status) {
                this.$emit('fCreativeSearchEmit', data, status);
                if (this.emitToWindowFunc === true)
                    window.fCreativeSearchCallback(data, status);
            }
        }
    }
</script>