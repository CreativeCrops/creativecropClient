store.registerModel("crop-params",{
    CropParams:Lyte.attr("object")
});



store.registerAdapter("crop-params", {//No I18n
    host : "http://localhost:8000/",
    namespace : "cropApi",
    actionNamespace : "actions",
    headersForRequest:function(headers){
        return {
            'API_KEY': 'VXNlIHRoaXMgZnJlZSB0b29sIHRvIHR1cm4gYmluYXJ5IGRhdGEgaW50byB0ZXh0',
        };
    }
});
