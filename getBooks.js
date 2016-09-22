var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var url = require('url');
var exec = require('child_process').exec;
var escapeStringRegexp = require('escape-string-regexp');

var DOWNLOAD_DIR = "./downloads/";


function readLines(input, func) {
  var remaining = '';

  input.on('data', function(data) {
    remaining += data;

    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      func(line);
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
    }
  });
}

function func(data) {
  console.log('Make request to: ' + data);
    request(data, function(err, resp, body){
      if(err) return;

      console.log("Status code: "+resp.statusCode);

      var $ = cheerio.load(body);

      $('div.links-download > a').each(function (index){
        if(index < 1){
          var link = $(this).attr('href');
          // fs.appendFileSync('linksDownloads.txt', link + '\n');
          download_file_wget(link);
        }
      }).text();
    });

}



var download_file_wget = function(file_url) {
    var urlParsed = escapeStringRegexp(encodeURI(file_url));

    // extract the file name
    var file_name = url.parse(urlParsed).pathname.split('/').pop();
    // compose the wget command
    var wget = 'wget -P ' + DOWNLOAD_DIR + ' ' + urlParsed;
    console.log("executando o wget => ",wget);
    // excute wget using child_process' exec function

    var child = exec(wget, function(err, stdout, stderr) {
        if (err){
          var errLog = "Erro no download do livro : "+ file_url + " ** Erro: "+err;
          fs.appendFileSync('erros.txt', errLog + '\n');
          return;
        } else {
          console.log(file_url + ' downloaded to ' + DOWNLOAD_DIR);
        }
    });
};

var input = fs.createReadStream('lelivros.txt');
readLines(input, func);
