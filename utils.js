var request = require('request');
var Q = require('q');

/**
 * 获取配置信息
 * @param {*} data 
 */
function getConfig(url, data) {
    var defferred = Q.defer();

    request.get({
        url: url,
        qs: data,
        json: true
    }, function(err,httpResponse,body){

        if(err) {
            defferred.reject(err);
            return;
        }
        
        if(httpResponse.statusCode == 200) {
            defferred.resolve(body);
        }else {
            defferred.reject(err);
        }
    });

    return defferred.promise;
}

module.exports = {
    getConfig: getConfig
};
