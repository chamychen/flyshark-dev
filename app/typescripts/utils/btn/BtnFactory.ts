///<reference path="BtnModel.ts" />
///<reference path="EventModel.ts" />

namespace flyshark.utils.btn {
    /**
     * 默认按钮工厂
     * 
     * @export
     * @class BtnFactory
     */
    export class BtnFactory {
        /**
         * 自定义按钮
         * 
         * @param {string} id 
         * @param {string} title 
         * @param {EventModel[]} events 
         * @param {string} iconClass 
         * @param {boolean} [isOnlyIcon=false] 
         * @param {string} [cssClass="btn-sm text-primary"] 
         * @returns 
         * @memberof BtnFactory
         */
        static createBtn(id: string, title: string, events: EventModel[], iconClass: string, isOnlyIcon: boolean = false, cssClass: string = "btn-sm text-primary", ) {
            return new BtnModel(id, title, events, iconClass, isOnlyIcon, cssClass);
        }

        /**
         * 新增按钮
         * 
         * @param {string} id 
         * @param {EventModel[]} events 
         * @param {boolean} [isOnlyIcon=false] 
         * @returns {BtnModel} 
         * @memberof BtnFactory
         */
        static createAddBtn(id: string, events: EventModel[], isOnlyIcon: boolean = false): BtnModel {
            return new BtnModel(id, "新增", events, "icon md-plus", isOnlyIcon, isOnlyIcon ? "icon-btn text-info" : "btn-info");
        }

        /**
         * 删除按钮
         * 
         * @param {string} id 
         * @param {EventModel[]} events 
         * @param {boolean} [isOnlyIcon=false] 
         * @returns 
         * @memberof BtnFactory
         */
        static createDelBtn(id: string, events: EventModel[], isOnlyIcon: boolean = false) {
            return new BtnModel(id, "删除", events, "icon md-close", isOnlyIcon, isOnlyIcon ? "icon-btn text-danger" : "btn-danger");
        }

        /**
         * 编缉按钮
         * 
         * @param {string} id 
         * @param {EventModel[]} events 
         * @param {boolean} [isOnlyIcon=false] 
         * @returns 
         * @memberof BtnFactory
         */
        static createEditBtn(id: string, events: EventModel[], isOnlyIcon: boolean = false) {
            return new BtnModel(id, "编缉", events, "icon md-edit", isOnlyIcon, isOnlyIcon ? "icon-btn text-warning" : "btn-warning");
        }

        /**
         * 保存按钮
         * 
         * @param {string} id 
         * @param {EventModel[]} events 
         * @param {boolean} [isOnlyIcon=false] 
         * @returns 
         * @memberof BtnFactory
         */
        static createSaveBtn(id: string, events: EventModel[], isOnlyIcon: boolean = false) {
            return new BtnModel(id, "保存", events, "icon fa-save", isOnlyIcon, isOnlyIcon ? "icon-btn text-primary" : "btn-primary");
        }
    }
}