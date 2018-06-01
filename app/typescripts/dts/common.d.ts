declare let Site: any;

declare let WebuiPopovers: any;

interface JQuery {
    toolbar(options: any): void;

    webuiPopover(...args: any[]): void;

    select2(options?: any): void;
}

interface Array<T> {
    for2(callBack: (value: T, index: number) => void): void;
}