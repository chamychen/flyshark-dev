///<reference path="../../entity/SystemBaseInfoEntity.ts" />
///<reference path="../../entity/UserInfoEntity.ts" />
///<reference path="../../entity/MenuEntity.ts" />

namespace flyshark.service.system {
    import SystemBaseInfoEntity = flyshark.entity.SystemBaseInfoEntity;
    import UserInfoEntity = flyshark.entity.UserInfoEntity;
    import MenuEntity = flyshark.entity.MenuEntity;

    export interface SystemService {
        /**
         * 当前目录
         * 
         * @type {MenuEntity}
         * @memberof SystemService
         */
        currentMenu: MenuEntity;
        /**
         * 获取系统基本信息
         */
        getSystemBaseInfo(): SystemBaseInfoEntity;

        /**
         * 获取用户个人信息和权限信息
         */
        getUserInfo(): UserInfoEntity;

        /**
         * 获取我有权限的目录
         * 
         * @returns {Array<MenuEntity>} 
         * @memberof SystemService
         */
        getMyMenu(): Array<MenuEntity>
    }
}