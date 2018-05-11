///<reference path="../../../dts/jquery.d.ts" />
///<reference path="../../../dts/jqgrid.d.ts" />
///<reference path="../../Common.ts" />
///<reference path="../../StringUtils.ts" />
///<reference path="../../btn/EventModel.ts" />
///<reference path="../../btn/BtnModel.ts" />
///<reference path="../enums/EditMode.ts" />
///<reference path="../enums/TreeColType.ts" />
///<reference path="../model/TreeIcons.ts" />
///<reference path="../model/TreeReader.ts" />
///<reference path="../model/ColModel.ts" />
///<reference path="../ColModelFactory.ts" />
///<reference path="DataDiff.ts" />
///<reference path="ColModel.ts" />

namespace flyshark.utils.grid.model {
    import Common = flyshark.utils.Common;
    import StringUtils = flyshark.utils.StringUtils;
    import EditMode = flyshark.utils.grid.enums.EditMode;
    import EventModel = flyshark.utils.btn.EventModel;
    import BtnModel = flyshark.utils.btn.BtnModel;
    import TreeColType = flyshark.utils.grid.enums.TreeColType;
    import TreeIcons = flyshark.utils.grid.model.TreeIcons;
    import TreeReader = flyshark.utils.grid.model.TreeReader;
    import ColModel = flyshark.utils.grid.model.ColModel;
    import ColModelFactory = flyshark.utils.grid.ColModelFactory;
    
    export class GridOption {
        /**
         * 加载原始数据
         * 
         * @type {any[]}
         * @memberof GridOption
         */
        oldData: any[];

        /**
         * 表格数据增、删、改记录
         * 
         * @type {DataDiff}
         * @memberof FsGridOption
         */
        dataDiff: DataDiff;

        /**
         * 编缉模式
         * 
         * @type {EditMode}
         * @memberof FsGridOption
         */
        editMode: EditMode = EditMode.OnlyView;

        /**
         * 按钮放置的容器
         */
        btnArea: any;

        /**
         * 按钮定义
         */
        btnModels: BtnModel[];

        /**
         * 主键列名称
         */
        keyName: string;

        /**
         * UI皮肤展现方式
         */
        styleUI: string = "Bootstrap";

        /**
         * 是否支持多选
         */
        multiselect: boolean = false;

        /**
         * 多选框列宽
         */
        multiselectWidth: number;

        /**
         * 当multiboxonly为ture时只有选择checkbox才会起作用
         */
        multiboxonly: boolean;


        /**
         * 是否需要搜索功能
         */
        searchable: boolean = false;

        /**
         * 表格id
         */
        id: string;

        /**
         * 最近焦点所在行的ID
         */
        lastFocusRowId: string;

        /**
         * 是否单体表格(独占一页)
         */
        isSingleTable: true;

        /**
         * 当为ture时，表格不会被显示，只显示表格的标题
         * 只有当点击显示表格的那个按钮时才会去初始化表格数据
         */
        hiddengrid: boolean = false;

        /**
         * 是否显示行号列
         * 
         * @type {boolean}
         * @memberof FsGridOption
         */
        rownumbers: boolean = true;

        /**
         * 行号列宽度
         * 
         * @type {number}
         * @memberof FsGridOption
         */
        rownumWidth: number = 60;

        /**
         * 当为true时让所选择的行可见
         * 
         * @type {boolean}
         * @memberof FsGridOption
         */
        scrollrows: boolean = true;

        /**
         * colModel
         */
        colModel: ColModel[];

        /**
         * 请求数据的地址
         */
        url: string;


        mtype: string = "GET";

        /**
         * 数据传输方式
         */
        datatype: string = "json";

        /**
         * 是否显示总记录数
         */
        viewrecords: boolean = true;

        /**
         * 如果为ture时，则当表格在首次被创建时会根据父元素比例重新调整表格宽度
         */
        autowidth: boolean = true;

        /**
         * 表格高度，可以是数字，像素值或者百分比。默认值为150
         */
        height: number | string = 150;


        /**
         * 是否有自动适应宽度的列
         */
        hasNotFixedCol: boolean;


        /**
         * 是否为treegrid
         */
        treeGrid: boolean = false;

        /**
        * 展开列
        */
        ExpandColumn: string;

        /**
         * treeGrid参数：当为true时，点击展开行的文本时，treeGrid就能展开或者收缩，不仅仅是点击图标时展开/收缩
         */
        ExpandColClick: boolean;

        /**
         * 表示返回数据的读取类型，分为两种：nested(树状)和adjacency(平面),默认值：nested
         */
        treeGridModel: string;


        /**
         * treegrid数据类型
         */
        treedatatype: string;

        /**
         * 树结构图标样式
         */
        treeIcons: TreeIcons;


        /**
         * 树结构colmodel读取模型
         * 
         * @type {TreeReader}
         * @memberof TreeGridOption
         */
        treeReader: TreeReader;


        /**
         * 单元格编缉的过滤方法
         * 
         * @memberof GridOption
         */
        filterCellEditMethod: (rowData: any) => { rowId: string, cellNames: string[] };

        /**
         * 当表格所有数据都加载完成而且其他的处理也都完成时触发此事件，排序，翻页同样也会触发此事件
         * 
         * @memberof GridOption
         */
        gridComplete: () => void;


        constructor(id: string, colModel: ColModel[], editMode: EditMode = EditMode.OnlyView, url?: string) {
            if (StringUtils.isEmpty(id)) {
                throw new Error("id不可为空！");
            }
            else if ($("#" + id).length == 0) {
                throw new Error(StringUtils.format("ID【{0}】指向的页面元素不存在！", id));
            }

            if (!colModel || colModel.length == 0) {
                throw new Error("colModel配置的个数必须大于0！");
            }
            if (this.isSingleTable) {
                this.height = Common.getWorkSpaceHeight();
            }
            this.id = id;
            this.colModel = colModel;
            this.editMode = editMode;
            this.url = url;
        }


        /**
         * 重置/初始化操作记录
         */
        resetDataDiff() {
            this.dataDiff = new DataDiff();
            this.dataDiff.addIds = [];
            this.dataDiff.updateIds = [];
            this.dataDiff.delIds = [];
            this.oldData = null;
        }


        /**
        * 优化colmodel
        */
        private optimizeColModel() {
            let optimizeColModels: ColModel[] = [];
            let hasNotFixedCol = false;//是否具有自动宽度的列
            this.colModel.forEach(col => {
                if (col.key) {
                    this.keyName = col.name;
                }
                if (!col.fixed) {
                    hasNotFixedCol = true;
                }
                optimizeColModels.push(col);
                //对treeGrid进行特别处理
                if (this.treeGrid && col.treeColType) {
                    switch (col.treeColType) {
                        case TreeColType.LongCodeField:
                            this.treeReader.long_code_field = col.name;
                            this.ExpandColumn = col.name;
                            if (this.editMode == EditMode.MultiRowEdit || this.editMode == EditMode.SingleRowEdit) {
                                let btnClass = "icon-btn icon-btn-nobg text-default";
                                let btns = [
                                    new BtnModel("toUp", "上移", [new EventModel("flyshark.utils.grid.GridHandler.onMoveNodePosition(this,1)")], "icon md-long-arrow-up", true, btnClass)
                                    , new BtnModel("toDown", "下移", [new EventModel("flyshark.utils.grid.GridHandler.onMoveNodePosition(this,2)")], "icon md-long-arrow-down", true, btnClass)
                                    , new BtnModel("toLeft", "左移", [new EventModel("flyshark.utils.grid.GridHandler.onMoveNodePosition(this,3)")], "icon md-long-arrow-left", true, btnClass)
                                    , new BtnModel("toRight", "右移", [new EventModel("flyshark.utils.grid.GridHandler.onMoveNodePosition(this,4)")], "icon md-long-arrow-right", true, btnClass)
                                    , new BtnModel("toCustom", "自定义长代码", [new EventModel("flyshark.utils.grid.GridHandler.onMoveNode(this)")], "icon md-keyboard", true, btnClass)
                                ];
                                let treeSortCol = ColModelFactory.createBtnColModel(btns, null, "结构控制", 100);
                                optimizeColModels.push(treeSortCol);
                            }
                            break;
                        case TreeColType.LinkNameField:
                            this.treeReader.link_name_field = col.name;
                            break;
                        case TreeColType.ParentField:
                            this.treeReader.parent_id_field = col.name;
                            break;
                    }
                }
            })
            //如果没有定义非固定列宽的列，则默认加一列，填充满表格
            if (!hasNotFixedCol) {
                let emptyCol = new ColModel("", "", 1, false);
                optimizeColModels.push(emptyCol);
            }
            this.hasNotFixedCol = hasNotFixedCol;
            this.colModel = optimizeColModels;
        }

        /**
        * 设置搜索栏展开／收缩按钮
        */
        private setSearchExtendBtn() {
            if (this.searchable) {
                if (!this.btnModels) {
                    this.btnModels = [];
                }
            }
            let eventModel = new EventModel("GridHandler.onSearchExtendBtnClick(this)");
            let searchExtendBtn = new BtnModel(this.id + "-search", "展开搜索条件区域", [eventModel], "icon fa-hourglass-1 search-control-icon", true, "btn-default");
            searchExtendBtn.htmlAttributtes = { dependon: this.id };
            this.btnModels.push(searchExtendBtn);
        }


        /**
         * 添加按钮到对象
         * 
         * @param {any} gridBtnList 按钮模型
         * @param {any} appendEl 要添加至的元素
         */
        private renderGridBtn() {
            if (this.btnModels && this.btnArea) {
                let areaEl = this.btnArea;
                this.btnModels.forEach(btnModel => {
                    if (!btnModel.htmlAttributtes) {
                        btnModel.htmlAttributtes = {};
                    }
                    btnModel.htmlAttributtes.dependon = this.id;
                    var html = btnModel.getHtml();
                    if (html) {
                        $(areaEl).append(html);
                    }
                })
            }
        }

        /**
         * 设为多选
         * @param multiboxonly 当multiboxonly为ture时只有选择checkbox才会起作用
         */
        setMultiSelect(multiboxonly: boolean = true): void {
            this.multiselect = true;
            this.multiselectWidth = 40;
            this.multiboxonly = multiboxonly;//当multiboxonly 为ture时只有选择checkbox才会起作用
            //多行编缉时只能通过多选框选中行
            if (this.editMode == EditMode.MultiRowEdit) {
                this.multiboxonly = true;
            }
        }

        /**
         * 设置表格的按钮
         * @param btnArea 按钮放置区域
         * @param btnModels 按钮
         */
        setGridButton(btnArea: JQuery<HTMLElement>, btnModels: BtnModel[]) {
            this.btnArea = btnArea;
            this.btnModels = btnModels;
        }

        /**
         * 渲染
         * 
         * @memberof GridOption
         */
        render() {
            let grid = $("#" + this.id);
            this.resetDataDiff();
            this.optimizeColModel();
            this.setSearchExtendBtn();
            grid.jqGrid(this);
            grid.jqGrid('bindKeys'); //支持键盘       
            this.renderGridBtn(); //渲染按钮 
            if (this.editMode == EditMode.OnlyView) {
                grid.addClass("only-view"); //表格仅查看
            }
            if (this.isSingleTable) {
                grid.addClass("single-table");//设为单页自适应表格
            }
        }
    }
}