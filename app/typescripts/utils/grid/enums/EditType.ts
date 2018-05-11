namespace flyshark.utils.grid.enums {
    /**
     * 编缉控件类型
     * 
     * @export
     * @enum {string}
     */
    export enum EditType {
        //按钮类
        button = 'button',
        //选择类
        select = "select",
        checkbox = 'checkbox',
        //文本类
        text = "text",
        textarea = "textarea",
        password = "password",
        email = "email",
        url = "url",
        tel = "tel",
        number = "number",
        search = "search",
        color = "color",
        //时间类
        date = "date",
        datetime = "datetime",
        datetimelocal = "datetime-local",
        year = "year",
        month = "month",
        week = "week",
        time = "time",
        range = "range",
        //图片类
        image = 'image',
        //文件类
        file = 'file',
        //自定义控件
        custom = 'custom',
    }
}