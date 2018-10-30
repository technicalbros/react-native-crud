"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var CrudRequest = /** @class */ (function () {
    function CrudRequest() {
        this.$config = {
            baseUrl: "",
            callbacks: {
                notify: function (data) {
                    alert(data.message);
                },
                checkSuccess: function (data) {
                    if (data.type === 'success') {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        };
    }
    CrudRequest.prototype.send = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var config = __assign({ checkDataType: true, notify: true }, _this.$config, options);
            var data = config.data, callbacks = config.callbacks, _a = config.method, method = _a === void 0 ? "get" : _a, baseUrl = config.baseUrl, url = config.url, redirectTo = config.redirectTo, showProgress = config.showProgress, _b = config.prefix, prefix = _b === void 0 ? "" : _b, checkDataType = config.checkDataType, ajaxOptions = config.ajaxOptions;
            var reloadPage = config.reload;
            var loading = callbacks.loading, reload = callbacks.reload, redirect = callbacks.redirect, checkSuccess = callbacks.checkSuccess, notify = callbacks.notify;
            var requestOptions = __assign({}, ajaxOptions, { method: method, credentials: "include", headers: {
                    "Content-type": "application/json"
                } });
            if (method.toLowerCase() === 'post')
                requestOptions.body = JSON.stringify(data);
            var _url = baseUrl + prefix + url;
            showProgress && loading && loading(true);
            fetch(_url, requestOptions).then(function (data) {
                data.json().then(function (response) {
                    showProgress && loading && loading(false);
                    if (checkSuccess) {
                        if (checkDataType && checkSuccess(response)) {
                            resolve(response);
                            // @ts-ignore
                            (redirectTo && redirect && redirect(redirectTo, response)) || (reloadPage && reload && reload());
                        }
                        else if (!checkDataType) {
                            resolve(response);
                        }
                        else {
                            reject(response);
                        }
                        var notification = {
                            type: response.type,
                            message: response.message
                        };
                        config.notify && notify && notify(notification);
                    }
                    else {
                        resolve(response);
                    }
                });
            }, reject);
        }).catch(function (data) {
            console.log(data);
        });
    };
    CrudRequest.prototype.create = function (url, data, options) {
        return this.send(__assign({ method: "post", prefix: "create/" }, options, { url: url, data: data }));
    };
    CrudRequest.prototype.update = function (url, data, options) {
        return this.send(__assign({ method: "post", prefix: "update/" }, options, { url: url, data: data }));
    };
    CrudRequest.prototype.delete = function (url, data, options) {
        return this.send(__assign({ method: "post", prefix: "delete/" }, options, { url: url, data: data }));
    };
    CrudRequest.prototype.retrieve = function (url, data, options) {
        return this.send(__assign({ method: "get", prefix: "retrieve/", checkDataType: false, notify: false }, options, { url: url, data: data }));
    };
    CrudRequest.prototype.alert = function (options) {
        return this.$config.callbacks.alert(options);
    };
    CrudRequest.prototype.confirm = function (options) {
        return this.$config.callbacks.confirm(options);
    };
    CrudRequest.prototype.prompt = function (options) {
        return this.$config.callbacks.prompt(options);
    };
    CrudRequest.prototype.dialog = function (name, options) {
        return this.$config.callbacks.dialog(name, options);
    };
    CrudRequest.prototype.notify = function (options) {
        this.$config.callbacks.notify(options);
    };
    CrudRequest.prototype.chooseFile = function (options) {
        return this.$config.callbacks.chooseFile(options);
    };
    return CrudRequest;
}());
exports.CrudRequest = CrudRequest;
//# sourceMappingURL=index.js.map