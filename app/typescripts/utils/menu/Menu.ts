namespace flyshark.utils.menu {
    export interface Menu {
        /**
         * 将menu模型转成html
         * 
         * @param {*} menuList 目录数据
         * @param {*} menuHtmlElement 填充目录html的对象
         * @returns {String} 
         * @memberof Menu
         */
        createMenu(menuList: any, menuHtmlElement: HTMLElement): void;
    }
}