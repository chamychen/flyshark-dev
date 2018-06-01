///<reference path="../dts/jquery.d.ts" />
///<reference path="../dts/jqgrid.d.ts" />
///<reference path="../utils/StringUtils.ts" />
///<reference path="DataModel.ts" />
///<reference path="../utils/grid/model/DataDiff.ts" />

namespace flyshark.dto {

    import StringUtils = flyshark.utils.StringUtils;
    import DataActionType = flyshark.dto.DataActionType;
    import DataAction = flyshark.dto.DataAction;
    import DataModel = flyshark.dto.DataModel;
    import RestMethod = flyshark.utils.rest.RestMethod;
    import DataDiff = flyshark.utils.grid.model.DataDiff;
    /**
     * 链式属性的前端容器类型
     * 
     * @export
     * @enum {number}
     */
    export enum LinkPropertyContextType {
        Form,
        Grid
    }

    /**
     * 前端链式模型
     * 
     * @export
     * @class LinkModel
     */
    export class LinkModel {
        instanceId: string;

        contextId: string;

        linkModelName: string;

        linkPropertys: {
            elementId: string, propertyId: string, linkPropertyContextType: LinkPropertyContextType
        }[];

        constructor(contextElement: HTMLElement | JQuery<HTMLElement>, linkModelName: string, instanceId?: string) {
            if (!contextElement) {
                throw new Error("页面容器元素不能为空！");
            }
            if (StringUtils.isEmpty(linkModelName)) {
                throw new Error("linkModelName不能为空！");
            }
            this.linkPropertys = [];
            let newId = StringUtils.newId();
            this.contextId = newId;
            this.linkModelName = linkModelName;
            this.instanceId = instanceId;
            $(contextElement).attr("id", this.contextId).addClass("link-model-context");
            //重置所有作用域内HTML元素的ID
            $(contextElement).find("[id]").each(function () {
                let id = this.id;
                $(this).attr("id", StringUtils.format("{0}_{1}", newId, id));
            });

        }

        /**
         * 获取作用域内的ID
         * 
         * @param {string} sourceId 
         * @returns 
         * @memberof LinkModel
         */
        getId(sourceId: string) {
            if (!StringUtils.isEmpty(sourceId)) {
                return StringUtils.format("{0}_{1}", this.contextId, sourceId);
            }
            else {
                return null;
            }
        }

        /**
         * 获取数据
         * 
         * @returns {DataModel[]} 
         * @memberof LinkModel
         */
        getData(): any {
            let result: any = {};
            if (this.linkPropertys && this.linkPropertys.length > 0) {
                this.linkPropertys.for2(p => {
                    if (StringUtils.isEmpty(p.elementId) || $("#" + p.elementId).length == 0) {
                        throw new Error("elementId配置为空或elementId指定的元素不存在！");
                    }
                    else if (StringUtils.isEmpty(p.propertyId)) {
                        throw new Error("propertyId不可配置为空！");
                    }
                    else {
                        let data: any = [];
                        let dataAction: DataAction[] = [];
                        let actionIds: string[] = [];
                        switch (p.linkPropertyContextType) {
                            case LinkPropertyContextType.Form:
                                data = $("form").serialize();
                                break;
                            case LinkPropertyContextType.Grid:
                                let gridData = $("#" + p.elementId).getDataToSave();
                                if (gridData) {
                                    if (gridData.addData) {
                                        gridData.addData.for2(d => {
                                            data.push(d);
                                        });
                                    }
                                    if (gridData.updateData) {
                                        gridData.updateData.for2(d => {
                                            data.push(d);
                                        });
                                    }
                                    if (gridData.addIds) {
                                        gridData.addIds.for2(id => {
                                            if (actionIds.indexOf(id) > -1) {
                                                throw new Error("同一记录存在多种操作异常！");
                                            }
                                            else {
                                                let action = new DataAction();
                                                action.id = id;
                                                action.linkPropertyName = p.propertyId;
                                                action.dataActionType = DataActionType.Add;
                                                dataAction.push(action);
                                            }
                                        })
                                    }
                                    if (gridData.updateIds) {
                                        gridData.updateIds.for2(id => {
                                            if (actionIds.indexOf(id) > -1) {
                                                throw new Error("同一记录存在多种操作异常！");
                                            }
                                            else {
                                                let action = new DataAction();
                                                action.id = id;
                                                action.linkPropertyName = p.propertyId;
                                                action.dataActionType = DataActionType.Update;
                                                dataAction.push(action);
                                            }
                                        })
                                    }
                                    if (gridData.delIds) {
                                        gridData.delIds.for2(id => {
                                            if (actionIds.indexOf(id) > -1) {
                                                throw new Error("同一记录存在多种操作异常！");
                                            }
                                            else {
                                                let action = new DataAction();
                                                action.id = id;
                                                action.linkPropertyName = p.propertyId;
                                                action.dataActionType = DataActionType.Del;
                                                dataAction.push(action);
                                            }
                                        })
                                    }
                                }
                                break;
                        }
                        if (dataAction && dataAction.length > 0) {
                            if (!data || data.length == 0) {
                                data = null;
                            }
                            result[p.propertyId] = data;
                            if (!result["dataActionList"]) {
                                result["dataActionList"] = dataAction;

                            }
                            else {
                                result["dataActionList"] = result["dataActionList"].concat(dataAction);
                            }
                        }
                    }
                })
            }
            else {
                throw new Error("linkPropertys配置不可为空！");
            }
            if (!result || result.length == 0) {
                result = null;
            }
            return result;
        }

        /**
         * 获取URL
         * 
         * @returns {string} 
         * @memberof LinkModel
         */
        getLoadUrl(): string {
            let url: string = null;
            if (!StringUtils.isEmpty(this.instanceId)) {

                url = StringUtils.format("/lm/{0}/{1}", this.linkModelName, this.instanceId);
            }
            else {
                url = StringUtils.format("/lm/{0}", this.linkModelName);

            }
            return flyshark.Flyshark.get().systemService.getServerUrl(url);
        }

        /**
         * 获取操作的URL
         * 
         * @returns {string} 
         * @memberof LinkModel
         */
        getActionUrl(): string {
            return flyshark.Flyshark.get().systemService.getServerUrl("/lm");
        }

        load() {
            flysharkApp.rest.query<Array<string>>(RestMethod.GET, this.getLoadUrl(), null, false,
                (result: ResponseModel<Array<string>>, status: any, xhr: any) => {
                    if (result.success) {
                        if (result.data) {
                            if (this.linkPropertys) {
                                this.linkPropertys.for2(p => {
                                    let thisData: any[] = result.data[p.propertyId];
                                    switch (p.linkPropertyContextType) {
                                        case LinkPropertyContextType.Form:
                                            break;
                                        case LinkPropertyContextType.Grid:
                                            $("#" + p.elementId).bindData(thisData);
                                            break;
                                    }
                                })
                            }
                        }
                    }
                }, null);
        }

        save<T>(successMethod?: (result: ResponseModel<Array<string>>, status: any, xhr: any) => void, errorMethod?: (result: ResponseModel<Array<string>>, status: any, xhr: any) => void) {
            let data = this.getData();
            if (data) {
                let model = this.linkModelName;
                let requestModel = new RequestModel();
                requestModel.data = StringUtils.toJsonString(data);
                requestModel.model = model;
                flysharkApp.rest.query<Array<string>>(RestMethod.POST, this.getActionUrl(), requestModel, true, successMethod, errorMethod);
                if (this.linkPropertys) {
                    this.linkPropertys.for2(p => {
                        switch (p.linkPropertyContextType) {
                            case LinkPropertyContextType.Form:
                                break;
                            case LinkPropertyContextType.Grid:
                                let newD = $("#" + p.elementId).searchData(null, false, false);
                                $("#" + p.elementId).setN({ oldData: newD, dataDiff: new DataDiff() }, false);
                                break;
                        }
                    })
                }
            }
        }
    }
}