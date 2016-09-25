var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var URL_PRINCIPAL = "http://lelivros.me/book/page/";
var NUMERO_PAGINAS = 421;
var urls = [];

for (var i = 0; i <= NUMERO_PAGINAS; i++) {
  var urlCompleta = [URL_PRINCIPAL,i,'/'].join('');
  urls.push(urlCompleta);
}


urls.forEach(function(url){
  request(url, function(err, resp, body){
    if(err) console.log("Erro no request: ", err);

    console.log("Status code: "+resp.statusCode);

    var $ = cheerio.load(body);

    $('ul.products > li').each(function (index){
      var link = $(this).find('a').attr('href');
      fs.appendFileSync('lelivros.txt', link + '\n');
    }).text();
  });
});
