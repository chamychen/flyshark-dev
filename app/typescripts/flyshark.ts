///<reference path="dts/jquery.d.ts" />
///<reference path="dts/jqgrid.d.ts" />
///<reference path="dts/common.d.ts" />
///<reference path="utils/Common.ts" />
///<reference path="service/system/SystemService.ts" />
///<reference path="service/system/SystemServiceImpl.ts" />
///<reference path="utils/grid/handler/BaseHandler.ts" />
///<reference path="utils/grid/handler/TreeHandler.ts" />
///<reference path="utils/grid/handler/ActionHandler.ts" />
///<reference path="utils/rest/JqueryRestImpl.ts" />



namespace flyshark {
    import Common = flyshark.utils.Common;
    import Rest = flyshark.utils.rest.Rest;
    import JqueryRestImpl = flyshark.utils.rest.JqueryRestImpl;
    import RestMethod = flyshark.utils.rest.RestMethod;
    import SystemService = flyshark.service.system.SystemService;
    import SystemServiceImpl = flyshark.service.system.SystemServiceImpl;
    import BaseHandler = flyshark.utils.grid.handler.BaseHandler;
    import TreeHandler = flyshark.utils.grid.handler.TreeHandler;
    import ActionHandler = flyshark.utils.grid.handler.ActionHandler;

    export class Flyshark {
        /**
         * 获取系统全局变量
         * 
         * @returns 
         * @memberof Flyshark
         */
        static get(): App {
            let w: any = window;
            let flyshark = w["Flyshark"];
            if (!flyshark) {
                flyshark = new App();
                w["Flyshark"] = flyshark;
            }
            return flyshark;
        }
    }

    class App {

        systemService: SystemService = new SystemServiceImpl();

        rest: Rest = new JqueryRestImpl();

        linkModels: { id: string, instance: any }[] = [];

        constructor() {
            Common.setScreenClass();
            this.initAlertify();
            this.initJQGrid();
            this.initWindowOnResize();
        }

        /**
         * 初始化alertifyjs
         */
        private initAlertify() {
            alertify.defaults.transition = "slide";
            alertify.defaults.theme.ok = "btn btn-primary";
            alertify.defaults.theme.cancel = "btn btn-danger";
            alertify.defaults.theme.input = "form-control";
            alertify.defaults.glossary.title = "";
            alertify.defaults.glossary.ok = "确定";
            alertify.defaults.glossary.cancel = "取消";
            // alertify.defaults.frameless = true;
        }

        /**
         * 扩展JQGRID
         */
        private initJQGrid() {
            let j: any = $.jgrid;
            j.extend(new BaseHandler());
            j.extend(new TreeHandler());
            j.extend(new ActionHandler());
        }

        /**
         * 初始化Window.onResize
         * 
         * @memberof Flyshark
         */
        private initWindowOnResize() {
            window.onresize = function () {
                $(".ui-jqgrid-btable").each(function () {
                    $(this).autoSize();
                });
            }
        }

        callEvent(eventTarget: HTMLElement, eventMethod: string): void {
            let context = $(eventTarget).closest(".link-model-context");
            if (!context || context.length == 0) {
                throw new Error("触发控件未包含在.link-model-context容器中！");
            }
            else {
                let contextId = $(context).attr("id");
                this.linkModels.for2(l => {
                    if (l.id == contextId) {
                        l.instance["save"]();      
                        return false;
                    }
                })
            }
        }
    }
}

