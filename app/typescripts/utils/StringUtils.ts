namespace flyshark.utils {
    export class StringUtils {
        /**
         * 防止跨域脚本攻击
         * 
         * @static
         * @param {string} str 
         * @returns 
         * @memberof StringUtils
         */
        public static xssFilterString(str: string) {
            if (!StringUtils.isEmpty(str)) {
                str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return str;
            }
            return str;
        }

        /**
         * 防止跨域脚本攻击
         * 
         * @static
         * @param {*} obj 
         * @returns {*} 
         * @memberof StringUtils
         */
        public static xssFilterObject(obj: any): any {
            if (!obj) {
                return null;
            }
            else {
                let jsonStr = StringUtils.toJsonString(obj);
                return JSON.parse(jsonStr);
            }
        }

        /**
         * 是否为空文本
         * 
         * @static
         * @param {string} str 
         * @returns {boolean} 
         * @memberof StringUtils
         */
        public static isEmpty(str: string): boolean {
            if (!str) {
                return true;
            }
            else {
                var val = StringUtils.trim(str);
                return !val;
            }
        }

        /**
         * 去除空格
         * 
         * @static
         * @param {string} str 
         * @returns {string} 
         * @memberof StringUtils
         */
        public static trim(str: string): string {
            if (!str) {
                return str;
            }
            else {
                str = str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
                return str;
            }
        }

        /**
         * 转换为json对象(内部对跨域脚本攻击对象进行处理)
         * 
         * @static
         * @param {string} str 
         * @returns {*} 
         * @memberof StringUtils
         */
        public static toJsonObject(str: string): any {
            if (StringUtils.isEmpty(str)) {
                return null;
            }
            else {
                str = StringUtils.xssFilterString(str);
                return eval("(" + str + ")");
            }
        }

        /**
         * 转换为json字符串
         * 
         * @static
         * @param {any} obj 
         * @returns {String} 
         * @memberof StringUtils
         */
        public static toJsonString(obj: any): string {
            var str = StringUtils.xssFilterString(JSON.stringify(obj));
            return str;
        }

        /**
         * 生成guid
         * 
         * @static
         * @returns {String} 
         * @memberof StringUtils
         */
        public static newId(): String {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        }

        /**
         * 格式化字符串
         * 
         * @static
         * @param {string} str 输入字符串
         * @param {Array<any>} args 参数
         * @returns {string} 
         * @memberof StringUtils
         */
        public static format(str: string, args: Array<any>): string {
            if (!args || args.length == 0) {
                return null;
            }
            else {
                for (var i = 0; i < args.length; i++) {
                    var re = new RegExp('\\{' + (i) + '\\}', 'gm');
                    str = str.replace(re, args[i]);
                }
                return str;
            }
        }
    }
}

