var through = require('through2');
var utils = require('./utils.js');

module.exports = function keywordsReplace(options){
	options = options || {};
    var newOptions = {
		protocol: options.protocol || 'http',
		host: options.host || '10.141.0.103',
		port: options.port || '9999',
		path: options.path || '/getProtocolMessage',
		data: options.data || {
			os: 'web'
		}
	};

    // 创建stream对象，每个文件都会经过这个stream对象
    var stream = through.obj(function(file, encode, cb){
		var url = newOptions.protocol+'://'+newOptions.host+':'+newOptions.port+newOptions.path

		utils.getConfig(url, {"callback":"callback"}).then(function(data){
			var protocol_message = data;

			if(protocol_message != null) {
				var contents = file.contents.toString(encode);

				//替换协议版本
				contents = contents.replace("$protocol$", protocol_message['protocol'])

				//替换关键字段
				for (var i = 0; i < protocol_message['obfuscate_data'].length; i++) {
					var replace_str = '$' + protocol_message['obfuscate_data'][i]["jsonPath"] + '$';
					contents = contents.replace(replace_str, protocol_message['obfuscate_data'][i]["obfuscateName"]);
				}

				file.contents = new Buffer(contents, encode);

				cb(null, file, encode);
			}else {
				console.log('protocol_message is null');
				cb('protocol_message is null', file, encode);
				throw 'protocol_message is null';
			}
		}, function(err){
			console.log(JSON.stringify(err));
			throw JSON.stringify(err);
			cb(err, file, encode);
		});
    });

    // 返回stream对象
    return stream;
};