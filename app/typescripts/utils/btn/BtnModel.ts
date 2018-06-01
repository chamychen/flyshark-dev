///<reference path="EventModel.ts" />

namespace flyshark.utils.btn {

    /**
     * 按钮模型
     */
    export class BtnModel {
        id: string;

        /**
         * 按钮标题
         */
        title: string;

        /**
         * 按钮的class
         */
        cssClass: string;


        /**
         * 事件
         */
        events: EventModel[];

        /**
         * icon图标对应的class
         */
        iconClass?: string;

        /**
         * 仅显示图标
         */
        isOnlyIcon: boolean;

        /**
         * 子按钮（通常显示为下拉按钮列表）
         */
        child?: BtnModel[];

        /**
         * html属性
         */
        htmlAttributtes: any;

        /**
         * Grid行内按钮的html模板
         */
        htmlTemplate: string;


        constructor(id: string, title: string, events: EventModel[], iconClass: string, isOnlyIcon: boolean = false, cssClass: string = "btn-sm text-primary", ) {
            this.id = id;
            this.title = title;
            this.events = events;
            this.iconClass = iconClass;
            this.isOnlyIcon = isOnlyIcon;
            this.cssClass = cssClass;
            if (isOnlyIcon && StringUtils.isEmpty(this.iconClass)) {
                throw new Error("isOnlyIcon为true时iconClass不能为空！");
            }
        }

        /**
         * 
         * @param btnModel 获取按钮的HTML
         */
        public getHtml(): string {
            let html: string = null;
            if (!StringUtils.isEmpty(this.id) && !StringUtils.isEmpty(this.title)) {
                let eventHtml = "";
                if (this.events) {
                    this.events.for2(eventModel => {
                        eventHtml += eventModel.getEventHtml();
                    })
                }
                //普通按钮
                if (!this.child) {
                    html = StringUtils.format('<button type="button" id="{0}" class="btn {1} waves-effect waves-classic" title="{4}" {5} {6}>{2}{3}</button>', this.id, this.cssClass ? this.cssClass : "btn-primary", this.iconClass ? StringUtils.format('<i class="{0}"></i> ', this.iconClass) : "", this.isOnlyIcon ? "" : this.title, this.title, StringUtils.objectToHtmlAttribute(this.htmlAttributtes), eventHtml);
                }
                //下拉铵钮
                else {
                    html = '<div class="btn-group" role="group">';
                    html += StringUtils.format('<button type="button" id="{0}" class="btn {1} waves-effect waves-classic" data-toggle="dropdown" title="{4}" {5} {6}>{2}{3}<i class="icon md-caret-down"/></button>', this.id, this.cssClass ? this.cssClass : "btn-primary", this.iconClass ? StringUtils.format('<i class="{0}"></i> ', this.iconClass) : "", this.isOnlyIcon ? "" : this.title, this.title, StringUtils.objectToHtmlAttribute(this.htmlAttributtes), eventHtml);
                    html += StringUtils.format('<div class="dropdown-menu">', this.id); if (this.child && this.child.length > 0) {
                        this.child.for2(btn => {
                            html += StringUtils.format('<a id="{0}" class="dropdown-item" href="javascript:void(0)" role="menuitem" {3}>{1}{2}</a>', btn.id, btn.iconClass ? StringUtils.format('<i class="{0}"></i> ', btn.iconClass) : "", btn.title ? btn.title : "", StringUtils.objectToHtmlAttribute(btn.htmlAttributtes), eventHtml);
                        })
                    }
                    html += '</div></div>';
                }
            }
            return html;
        }
    }
}