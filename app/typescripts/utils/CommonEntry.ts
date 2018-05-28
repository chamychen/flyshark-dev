///<reference path="../dto/LinkModel.ts" />

namespace flyshark.utils {
    import LinkModel = flyshark.dto.LinkModel;

    export abstract class CommonEntry {
        protected linkModel: LinkModel;

        constructor(contextId: string, linkModelName: string) {
            if (StringUtils.isEmpty(contextId)) {
                throw new Error("linkModelName不能为空！");
            }
            else if (StringUtils.isEmpty(linkModelName)) {
                throw new Error("linkModelName不能为空！");
            }
            this.linkModel = new LinkModel($("#" + contextId), linkModelName);
            this.register();
        }


        /**
         * 注册进全局管理容器
         * 
         * @private
         * @memberof MenuEntry
         */
        private register() {
            //注册模型
            flysharkApp.linkModels.push({ id: this.linkModel.contextId, instance: this });
        }

        /**
         * 初始化
         * 
         * @memberof MenuEntry
         */
        abstract init(): void;
    }
}