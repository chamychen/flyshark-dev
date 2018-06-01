///<reference path="../StringUtils.ts" />
///<reference path="../btn/BtnModel.ts" />
///<reference path="model/ColModel.ts" />
///<reference path="enums/TreeColType.ts" />

namespace flyshark.utils.grid {

    import StringUtils = flyshark.utils.StringUtils;
    import BtnModel = flyshark.utils.btn.BtnModel;
    import ColModel = flyshark.utils.grid.model.ColModel;
    import TreeColType = flyshark.utils.grid.enums.TreeColType;

    export class ColModelFactory {

        /**
         * 创建普通列
         * 
         * @static
         * @param {string} name 数据库字段名
         * @param {string} title 标题
         * @param {number} [width=80] 宽度
         * @param {boolean} [fixed=true] 是否固定宽度
         * @param {(cellvalue: any, options: any, rowObject: any) => string} [formatter] 格式化方法
         * @returns {ColModel} 
         * @memberof ColModel
         */
        static createDefaultColModel(name: string, title: string, width: number = 80, fixed: boolean = true, formatter?: (cellvalue: any, options: any, rowObject: any) => string): ColModel {
            let colModel = new ColModel(name, title, width, fixed, formatter);
            return colModel;
        }

        /**
        * 创建编缉列
        * 
        * @static
        * @param {string} name 数据库字段名
        * @param {string} title 
        * @param {number} [width=80] 
        * @param {boolean} [fixed=true] 
        * @param {(cellvalue: any, options: any, rowObject: any) => string} [formatter] 
        * @memberof ColModel
        */
        static createEditColModel(name: string, title: string, width: number = 80, fixed: boolean = true, formatter?: (cellvalue: any, options: any, rowObject: any) => string): ColModel {
            let colModel = new ColModel(name, title, width, fixed, formatter);
            colModel.editable = true;
            return colModel;
        }

        /**
         * 创建树形表格专用列
         * 
         * @static
         * @param {string} name 数据库字段名
         * @param {TreeColType} treeColType 树形表格专用列类型
         * @returns {ColModel} 
         * @memberof ColModel
         */
        static createTreeColModel(name: string, treeColType: TreeColType): ColModel {
            let colModel = new ColModel(name, treeColType, null, null, null);
            colModel.treeColType = treeColType;
            switch (treeColType) {
                case TreeColType.LinkNameField:
                    colModel.ignoreUpdate = false;
                    colModel.width = 80;
                    colModel.fixed = true;
                    break;
                case TreeColType.LongCodeField:
                    colModel.ignoreUpdate = false;
                    colModel.width = 120;
                    colModel.fixed = true;
                    break;
                case TreeColType.ParentField:
                    colModel.ignoreUpdate = false;
                    colModel.hidden = true;
                    colModel.fixed = true;
                    break;
                case TreeColType.SortField:
                    colModel.ignoreUpdate = false;
                    colModel.hidden = true;
                    colModel.fixed = true;
                case TreeColType.LeafField:
                    colModel.ignoreUpdate = true;
                    colModel.hidden = true;
                    colModel.fixed = true;
            }
            colModel.minWidth = colModel.width;
            return colModel;
        }

        /**
         * 创建按钮列
         * 
         * @static
         * @param {BtnModel[]} btnModels 
         * @param {(btnModels: any[], rowdata: any, options: any) => BtnModel[]} filterButton 行内按钮过滤
         * @param {string} [title="操作"] 
         * @param {number} [width=80] 
         * @returns {ColModel} 
         * @memberof ColModelFactory
         */
        static createBtnColModel(btnModels: BtnModel[], filterButton?: (btnModels: any[], rowdata: any, options: any) => BtnModel[], title: string = "操作", width: number = 80): ColModel {
            if (!btnModels || btnModels.length == 0) {
                throw new Error("按钮列按钮个数不能为0！");
            }

            //实例化
            let colModel = new ColModel(title, title, width, true, (cellvalue: any, options: any, rowdata: any): string => {
                let html = "";
                let validBtnModels: BtnModel[] = null;
                if (filterButton) {
                    validBtnModels = filterButton(options.colModel.btnModels, rowdata, options);
                }
                else {
                    validBtnModels = options.colModel.btnModels;
                }
                if (validBtnModels) {
                    validBtnModels.for2(btnModel => {
                        html += StringUtils.format(btnModel.htmlTemplate, options.rowId, options.gid);
                    })
                }
                return html;
            });
            //初始化行内按钮
            btnModels.for2(btnModel => {
                if (!btnModel.htmlAttributtes) {
                    btnModel.htmlAttributtes = {};
                }
                btnModel.htmlAttributtes.defineBtnId = btnModel.id;
                var html = btnModel.getHtml();
                if (html) {
                    html = html.replace(StringUtils.format('id="{0}"', btnModel.id), 'id="{0}_' + btnModel.id + '" dependon="{1}" dependrowid="{0}" ');
                }
                btnModel.htmlTemplate = html;
            })
            colModel.btnModels = btnModels;
            colModel.canGetValue = false;
            return colModel;
        }

        /**
         * 创建隐藏列
         * 
         * @static
         * @param {string} name 数据库字段名
         * @param {boolean} [key=false] 是否主键
         * @returns 
         * @memberof ColModel
         */
        static createHiddenColModel(name: string, key: boolean = false): ColModel {
            let colModel = new ColModel(name, name);
            colModel.hidden = true;
            colModel.key = key;
            return colModel;
        }
    }
}