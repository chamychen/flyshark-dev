///<reference path="../Common.d.ts" />
///<reference path="../StringUtils.ts" />
///<reference path="Menu.ts" />
///<reference path='../../entity/MenuEntity.ts' />
///<reference path='../../entity/UserDataEntity.ts' />


namespace flyshark.utils.menu {
    import MenuEntity = flyshark.entity.MenuEntity;
    import UserDataEntity = flyshark.entity.UserDataEntity;

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
         * 跳转到目录
         * 
         * @param {string} menuId 
         * @param {UserData} userData 
         * @returns 
         * @memberof MMenutImpl
         */
        public toMenu(menuId: string, userData: UserDataEntity): void {
            if (!menuId || !userData || !userData.menuList || (userData.currentMenu && menuId == userData.currentMenu.menuId)) {
                return;
            }

            let currentMenu: MenuEntity = null;
            userData.menuList.forEach((menu: MenuEntity) => {
                if (menu.menuId == menuId) {
                    currentMenu = menu;
                    return false;
                }
            })

            if (currentMenu && currentMenu.url) {
                $(".page").hide();
                userData.currentMenu = currentMenu;
                var html = this.setMenuActive(null, userData);
                html = "<ol class='breadcrumb'>" + html + "</ol>";
                $(".page-header .breadcrumb").remove("");
                $(".page-header").prepend(html);
                $(".page .page-content-body").load(currentMenu.url);
                $(".page").fadeIn(1000);
            }
        }

        /**
     * 设置菜单被选中，返回路径的html
     * @param iterationMenu
     * @returns {string}
     */
        private setMenuActive(iterationMenu: MenuEntity, userData: UserDataEntity) {
            var html = "";
            //清除active目录
            if (iterationMenu == null) {
                $(".site-menu-item").each(function () {
                    if ($(this).hasClass("active")) {
                        $(this).removeClass("active");
                    }
                });
                iterationMenu = userData.currentMenu;

                html = StringUtils.format("<li class='breadcrumb-item active'>{0}{1}</li>",
                    [!StringUtils.isEmpty(iterationMenu.iconClass) ?
                        StringUtils.format("<i class='site-menu-icon fa {0}' aria-hidden=\"true\"></i> ", [iterationMenu.iconClass]) : "", iterationMenu.menuTitle]);
            }
            else {
                html = StringUtils.format("<li class='breadcrumb-item'>{0}{1}</li>", [!StringUtils.isEmpty(iterationMenu.iconClass) ? StringUtils.format("<i class='{0}' aria-hidden=\"true\"></i> ", [iterationMenu.iconClass]) : "", iterationMenu.menuTitle]);
            }
            if (iterationMenu != null) {
                $("#" + iterationMenu.menuId).closest("li").addClass("active");
                if (iterationMenu.parentMenuId) {
                    userData.menuList.forEach((menu: MenuEntity) => {
                        if (menu.menuId == iterationMenu.parentMenuId) {
                            html = this.setMenuActive(menu, userData) + html;
                            return false;
                        }
                    })
                }
            }
            return html;
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