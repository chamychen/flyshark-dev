///<reference path="../entity/systemBaseInfo.ts" />
///<reference path="../entity/userInfo.ts" />

namespace flyshark.service {
    import SystemBaseInfo = flyshark.entity.SystemBaseInfo;
    import UserInfo = flyshark.entity.UserInfo;

    export interface SystemService {
        /**
         * 获取系统基本信息
         */
        getSystemBaseInfo(): SystemBaseInfo;

        /**
         * 获取用户个人信息和权限信息
         */
        getUserInfo(): UserInfo;
    }
}