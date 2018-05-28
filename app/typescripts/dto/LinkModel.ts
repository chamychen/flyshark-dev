///<reference path="../dts/jquery.d.ts" />
///<reference path="../dts/jqgrid.d.ts" />
///<reference path="../utils/StringUtils.ts" />

namespace flyshark.dto {

    import StringUtils = flyshark.utils.StringUtils;

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
        contextId: string;

        linkModelName: string;

        linkPropertys: {
            elementId: string, propertyId: string, linkPropertyContextType: LinkPropertyContextType
        }[];

        constructor(contextElement: HTMLElement | JQuery<HTMLElement>, linkModelName: string) {
            if (!contextElement) {
                throw new Error("页面容器元素不能为空！");
            }
            if (StringUtils.isEmpty(linkModelName)) {
                throw new Error("linkModelName不能为空！");
            }
            this.linkPropertys = [];
            let newId = StringUtils.newId();
            this.contextId = newId;
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
         * @returns {{ pName: string, data: any }[]} 
         * @memberof LinkModel
         */
        getData(): { pName: string, data: any }[] {
            let result: { pName: string, data: any }[] = null;
            if (this.linkPropertys && this.linkPropertys.length > 0) {
                this.linkPropertys.forEach(p => {
                    if (StringUtils.isEmpty(p.elementId) || $("#" + p.elementId).length == 0) {
                        throw new Error("elementId配置为空或elementId指定的元素不存在！");
                    }
                    else if (StringUtils.isEmpty(p.propertyId)) {
                        throw new Error("propertyId不可配置为空！");
                    }
                    else {
                        let data: any = null;
                        switch (p.linkPropertyContextType) {
                            case LinkPropertyContextType.Form:
                                data = $("form").serialize();
                                break;
                            case LinkPropertyContextType.Grid:
                                data = $("#" + p.elementId).getDataToSave();
                                break;
                        }
                        if (data) {
                            if (!result) {
                                result = [];
                                result.push({ pName: p.propertyId, data: data });
                            }
                        }
                    }
                })
            }
            else {
                throw new Error("linkPropertys配置不可为空！");
            }
            return result;
        }
    }
}