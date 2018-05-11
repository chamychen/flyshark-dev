///<reference path="../../entity/MenuEntity.ts" />


namespace flyshark.service.menu {
    import MenuEntity = flyshark.entity.MenuEntity;

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
    }
}