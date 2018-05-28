namespace flyshark.utils.btn {

    /**
     * 事件模型
     */
    export class EventModel {
        name: string;
        method: string;

        constructor(method: string, name: string = "click") {
            this.name = name;
            this.method = method;
        }

        /**
         * 获取事件的html
         */
        public getEventHtml(): string {
            if (!StringUtils.isEmpty(this.name) && !StringUtils.isEmpty(this.method)) {
                this.method = this.method.replace("\"", "'");
                return StringUtils.format(" on{0}=\"{1}\" ", this.name, this.method);
            }
            else {
                return "";
            }
        }
    }
}