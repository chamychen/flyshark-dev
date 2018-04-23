///<reference path="../../entity/MenuEntity.ts" />
///<reference path="../../entity/UserDataEntity.ts" />

namespace flyshark.utils.menu {
    import MenuEntity = flyshark.entity.MenuEntity;
    import UserDataEntity = flyshark.entity.UserDataEntity;

    export interface Menu {
        /**
         * 将menu模型转成html
         * 
         * @param {*} menuList 目录数据
         * @param {*} menuHtmlElement 填充目录html的对象
         * @returns {String} 
         * @memberof Menu
         */
        createMenu(menuList: Array<MenuEntity>, menuHtmlElement: HTMLElement): void;

        /**
         * 跳转到目录
         * 
         * @param {string} menuId 
         * @param {*} userData 
         * @memberof Menu
         */
        toMenu(menuId: string, userData: UserDataEntity): void;
    }
}