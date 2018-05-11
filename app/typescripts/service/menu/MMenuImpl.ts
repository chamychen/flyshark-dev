///<reference path="../../dts/jquery.d.ts" />
///<reference path="../../dts/common.d.ts" />
///<reference path="../../utils/StringUtils.ts" />
///<reference path='../../entity/MenuEntity.ts' />
///<reference path="Menu.ts" />

namespace flyshark.service.menu {
    import StringUtils = flyshark.utils.StringUtils;
    import MenuEntity = flyshark.entity.MenuEntity;


    /**
     * MMenu目录创建支持
     * 
     * @export
     * @class MMenutImpl
     * @implements {Menu}
     */
    export class MMenutImpl implements Menu {


        /**
         * 生成目录(只有刷新页面后才能调用该方法)
         * 
         * @param {*} menu 
         * @returns {String} 
         * @memberof MMenutImpl
         */
        public createMenu(menuList: Array<MenuEntity>, menuHtmlElement: HTMLElement): void {
            let html = this.getMenuHtml(menuList, null);
            if (menuHtmlElement) {
                menuHtmlElement.innerHTML = html;
                let menubar = Site.getInstance().menubar;
                Site.run();
            }
        }

        /**
         * 迭代方式生成目录
         * 
         * @private
         * @param {*} menuList 
         * @param {*} iteration 
         * @returns {string} 
         * @memberof MMenutImpl
         */
        private getMenuHtml(menuList: Array<MenuEntity>, iteration: any): string {
            let html = "";
            if (menuList != null && menuList.length > 0) {
                if (!iteration) {
                    html += "<ul class='site-menu'>";
                    let topMenu: Array<MenuEntity> = [];
                    menuList.forEach((menu: MenuEntity) => {
                        if (StringUtils.isEmpty(menu.parentMenuId)) {
                            topMenu.push(menu);
                        }
                    })
                    //顶级目录排序
                    topMenu.sort((a, b) => {
                        return a.sortNo - b.sortNo;
                    });
                    //从顶级目录向下迭代
                    topMenu.forEach((menu: MenuEntity) => {
                        html += this.getMenuHtml(menuList, menu);
                    })
                    html += "</ul>";
                }
                else {
                    //查找子目录
                    let childMenuList: Array<MenuEntity> = [];
                    menuList.forEach((menu: MenuEntity) => {
                        if (menu.parentMenuId == iteration.menuId) {
                            childMenuList.push(menu);
                        }
                    })


                    //组装当前菜单的HTML
                    var menuClick: string = childMenuList.length > 0 ? "" : " class='menu-a-click'  ";
                    var linkHtml = ` id="${iteration.menuId}" ${menuClick}`;
                    let iconHtml: string = "";
                    if (StringUtils.isEmpty(iteration.parentMenuId)) {
                        let iconClass = !iteration.iconClass ? "" : iteration.iconClass;
                        iconHtml = `<i class='site-menu-icon ${iconClass}' aria-hidden='true'></i>`;
                    }
                    if (StringUtils.isEmpty(iteration.menuTitle)) {
                        iteration.menuTitle = "";
                    }
                    if (childMenuList.length > 0) {
                        html = `<li class='site-menu-item has-sub'><a href='javascript:void(0)' ${linkHtml}>${iconHtml}<span class='site-menu-title'>${iteration.menuTitle}</span><span class='site-menu-arrow fa-angle-right'></span></a>`;
                    }
                    else {
                        html = `<li class='site-menu-item'><a href='javascript:void(0)' ${linkHtml}>${iconHtml}<span class='site-menu-title'>${iteration.menuTitle}</span></a>`;
                    }

                    //组装子菜单的HTML
                    //子菜单录排序
                    childMenuList.sort((a, b) => {
                        return a.sortNo - b.sortNo;
                    });
                    if (childMenuList.length > 0) {
                        html += "<ul class='site-menu-sub'>";
                        childMenuList.forEach((menu: MenuEntity) => {
                            html += this.getMenuHtml(menuList, menu);
                        })
                        html += "</ul>";
                    }
                    html += "</li>";
                }
                return html;
            }
        }
    }
}