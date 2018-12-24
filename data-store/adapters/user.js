store.registerAdapter("user", {//No I18n
    host : window.location.origin,
    namespace : "/v2/api",
    actionNamespace : "actions",
    headersForRequest:function(headers){
        return {
            'API_KEY': 'VXNlIHRoaXMgZnJlZSB0b29sIHRvIHR1cm4gYmluYXJ5IGRhdGEgaW50byB0ZXh0',
        };
    }
});

store.registerAdapter("crop-params", {//No I18n
    host : window.location.origin,
    namespace : "/v2/api",
    actionNamespace : "actions",
    headersForRequest:function(headers){
        return {
            'API_KEY': 'VXNlIHRoaXMgZnJlZSB0b29sIHRvIHR1cm4gYmluYXJ5IGRhdGEgaW50byB0ZXh0',
        };
    }
});

