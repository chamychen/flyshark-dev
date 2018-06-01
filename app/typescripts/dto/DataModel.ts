namespace flyshark.dto {
    /**
     * 数据操作类型
     * 
     * @export
     * @enum {number}
     */
    export enum DataActionType {
        Add = 1,
        Update,
        Del
    }

    /**
     * 数据应操作记录
     * 
     * @export
     * @class DataAction
     */
    export class DataAction {
        id: string;

        linkPropertyName: string;

        dataActionType: DataActionType
    }

    /**
     * 数据存储模型
     * 
     * @export
     * @class DataModel
     */
    export class DataModel {
        linkPropertyName: string;

        newData: any[];

        dataActionList: DataAction[];
    }
}