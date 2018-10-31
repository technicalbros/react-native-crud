import * as _ from "lodash";

export interface DefaultRequestOptions {
    baseUrl?: string,
    callbacks?: {
        loading?: (value: boolean) => void,
        redirect?: (to: any, data?: any) => void,
        reload?: () => void,
        checkSuccess?: (data: any) => boolean,
        notify?: (data: any) => void,
        chooseFile?: (options: any) => Promise<any>,
        dialog?: (component: any, options: any) => Promise<any>,
        prompt?: (options: any) => Promise<any>
        confirm?: (options: any) => Promise<any>
        alert?: (options: any) => Promise<any>
    }
}

export interface RequestOptions extends DefaultRequestOptions {
    prefix?: string,
    url?: string,
    data?: any,
    redirectTo?: string,
    checkDataType?: boolean,
    showProgress?: boolean,
    notify?: boolean,
    goto?: string,
    reload?: boolean,
    method?: "post" | "get" | "put" | "delete" | string
    ajaxOptions?: RequestInit
}

export interface ChooseFileOptions {
    accept?: string | string[],
    multiple?: boolean
}

export class CrudRequest {

    $config: DefaultRequestOptions = {
        baseUrl: "",
        callbacks: {
            notify: (data) => {
                alert(data.message);
            },
            checkSuccess: (data) => {
                if (data.type === 'success') {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    send(options: RequestOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            const config = {
                checkDataType: true,
                notify: true,
                ...this.$config,
                ...options,
            }

            const {data, callbacks, method = "get", baseUrl, url, redirectTo, showProgress, prefix = "", checkDataType, ajaxOptions} = config;
            const reloadPage = config.reload;
            const {loading, reload, redirect, checkSuccess, notify} = callbacks;


            let requestOptions: RequestInit = {
                ...ajaxOptions,
                method: method,
                credentials: "include",
                headers: {
                    "Content-type": "application/json"
                }
            }

            if (method.toLowerCase() === 'post')
                requestOptions.body = JSON.stringify(data);

            const _url = baseUrl + prefix + url;

            showProgress && loading && loading(true);

            fetch(_url, requestOptions).then(data => {
                data.json().then(response => {

                    showProgress && loading && loading(false);

                    if (checkSuccess) {
                        if (checkDataType && checkSuccess(response)) {
                            resolve(response);
                            // @ts-ignore
                            (redirectTo && redirect && redirect(redirectTo, response)) || (reloadPage && reload && reload());
                        } else if (!checkDataType) {
                            resolve(response);
                        } else {
                            reject(response);
                        }
                        const notification: any = {
                            type: response.type,
                            message: response.message
                        }
                        config.notify && notify && notify(notification);
                    } else {
                        resolve(response);
                    }
                })
            }, reject)

        }).catch(data => {
            console.log(data);
        })
    }

    create(url: string, data?: any, options?: RequestOptions): Promise<any> {
        return this.send({
            method: "post",
            prefix: "create/",
            ...options,
            url: url,
            data: data,
        })
    }

    update(url: string, data?: any, options?: RequestOptions) {
        return this.send({
            method: "post",
            prefix: "update/",
            ...options,
            url: url,
            data: data,
        })
    }

    delete(url: string, data?: any, options?: RequestOptions) {
        return this.send({
            method: "post",
            prefix: "delete/",
            ...options,
            url: url,
            data: data,
        })
    }

    retrieve(url: string, data?: any, options?: RequestOptions) {
        return this.send({
            method: "get",
            prefix: "retrieve/",
            checkDataType: false,
            notify: false,
            ...options,
            url: url,
            data: data,
        })
    }

    alert(options: any): Promise<any> {
        return this.$config.callbacks.alert(options);
    }

    confirm(options: any): Promise<boolean> {
        return this.$config.callbacks.confirm(options);
    }

    prompt(options: any): Promise<any> {
        return this.$config.callbacks.prompt(options);
    }

    dialog(name: string, options: any): Promise<any> {
        return this.$config.callbacks.dialog(name, options);
    }

    notify(options: any): void {
        this.$config.callbacks.notify(options);
    }

    chooseFile<T>(options?: any): Promise<T> {
        return this.$config.callbacks.chooseFile(options);
    }
}