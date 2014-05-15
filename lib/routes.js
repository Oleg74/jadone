'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    manager = require('./controllers/manager'),
    goods = require('./controllers/goods'),
    filters = require('./controllers/filter'),
    cakes = require('./controllers/cakes'),
    brand = require('./controllers/brand'),
    category = require('./controllers/category'),
    stuff = require('./controllers/stuff'),
    country = require('./controllers/country'),
    region = require('./controllers/region'),
    city = require('./controllers/city'),
    comment = require('./controllers/comment'),
    order = require('./controllers/order'),
//articles = require('./controllers/articles'),
//auth = require('./middlewares/authorization'),
    session = require('./controllers/session');


var middleware = require('./middleware');

var path = require('path');
var fs = require('fs');
//var mime = require('mime');
/**
 * Application routes
 */
module.exports = function(app) {




    // Server API Routes

    app.get('/api/categories/:id',api.categories_get);
    app.get('/api/config',goods.getConfig);
    app.get('/api/parse_xlsx',api.parse_xlsx);
    app.get('/api/lastnews',goods.lastNews)

    app.post('/api/config',goods.putConfig);
    app.get('/api/mainmenuitems/:lang',stuff.categories_list);


    app.post('/api/users', users.create);
    app.put('/api/users', users.changePassword);
    app.get('/api/users/me', users.me);
    app.get('/api/users/:id', users.show);
    app.get('/api/users/me', users.me);

    app.post('/api/session', session.login);
    app.delete('/api/session', session.logout);





    app.get('/api/goods/:id/:page',goods.list);
    app.get('/api/goods/type/page/:id',goods.get);
    app.delete('/api/goods/type/:id',goods.delete);
    app.post('/api/goods',goods.add);
    app.put('/api/goods',goods.add);
    app.post('/api/goods/fileUpload',goods.fileUpload);
    app.get('/api/goods/search/:lang/:searchStr',goods.search);

    app.get('/api/goods/comments/:id',goods.listComments);
    app.get('/api/goods/comments/:id/:idC',goods.getComments);
    app.post('/api/goods/comments',goods.addComments);
    app.put('/api/goods/comments',goods.addComments);
    app.delete('/api/goods/comments/:id/:idC',goods.deleteComments);
    //app.delete('/api/comments/:id/:idC',goods.deleteComments);

    app.post('/api/feedback',api.feedback);
    app.post('/api/fileUploadPdf',api.fileUpload);
    app.get('/api/fileDownloadPdf',function (req, res) {
        //console.log('sss');
//        var file = 'app/seo.pdf';
//
//        var filename = path.basename(file);
//        //var mimetype = mime.lookup(file);
//
//        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
//        res.setHeader('Content-type','application/pdf');
//
//        var filestream = fs.createReadStream(file);
//        filestream.pipe(res);

        //res.download('app/price.pdf');
        res.download('app/price.xls');
    })

    app.post('/api/order',order.add);
    app.get('/api/order',order.list);
    app.delete('/api/order/:id',order.delete);
    app.get('/api/order/:id',order.get);
    app.put('/api/order',order.add);

    app.get('/api/filters',filters.list);
    app.get('/api/filters/:id',filters.get);
    app.delete('/api/filters/:id',filters.delete);
    app.post('/api/filters',filters.add);
    app.put('/api/filters',filters.add);

    app.get('/api/tag/:filter',filters.tag_list);
    app.get('/api/tag/:filter/:id',filters.tag_get);
    app.delete('/api/tag/:filter/:id',filters.tag_delete);
    app.put('/api/tag/:filter',filters.tag_add);
    app.post('/api/tag/:filter',filters.tag_add);


    app.get('/api/brand',brand.list);
    app.get('/api/brand/:id',brand.get);
    app.delete('/api/brand/:id',brand.delete);
    app.post('/api/brand',brand.add);
    app.put('/api/brand',brand.add);
    app.post('/api/brandfile/fileUpload',brand.fileUpload);

    app.get('/api/brandtags/:brand',brand.tag_list);
    app.get('/api/brandtags/brand/:id',brand.tag_get);
    app.delete('/api/brandtags/:brand/:id',brand.tag_delete);
    app.post('/api/brandtags',brand.tag_add);
    app.put('/api/brandtags',brand.tag_add);
    app.post('/api/collectionfile/fileUpload',brand.fileUploadCollection);

    app.get('/api/category',category.list);
    app.get('/api/category/:id',category.get);
    app.delete('/api/category/:id',category.delete);
    app.post('/api/category',category.add);
    app.put('/api/category',category.add);
    app.post('/api/categoryfile/fileUpload',category.fileUpload);

    app.get('/api/stuff/:category/:brand/:page',stuff.list);
    app.get('/api/stuff/category/brand/page/:id',stuff.get);
    app.get('/api/stuff/category/brand/full/:id',stuff.full);
    app.post('/api/stuff/category/brand/page',stuff.add);
    app.put('/api/stuff/category/brand/page',stuff.add);
    app.put('/api/stuff/category/brand/gallery',stuff.updateGallery);
    app.post('/api/stufffile/fileUpload',stuff.fileUpload);
    app.delete('/api/stuff/:category/:brand/:page/:id',stuff.delete);
    app.post('/api/stufffile/fileUploadGallery',stuff.fileUploadGallery);
    app.get('/api/stufffile/fileGalleryDelete/:id/:index',stuff.fileGalleryDelete);


    app.get('/api/country',country.list);
    app.get('/api/country/:id',country.get);
    app.delete('/api/country/:id',country.delete);
    app.post('/api/country',country.add);
    app.put('/api/country',country.add);

    app.get('/api/region/:country',region.list);
    app.get('/api/region/country/:id',region.get);
    app.delete('/api/region/country/:id',region.delete);
    app.post('/api/region/country',region.add);
    app.put('/api/region/country',region.add);

    app.get('/api/city/:region',city.list);
    app.get('/api/city/region/:id',city.get);
    app.delete('/api/city/region/:id',city.delete);
    app.post('/api/city/region',city.add);
    app.put('/api/city/region',city.add);

   // app.get('/api/comment',comment.list);
    app.get('/api/commentStuff/:id',comment.get);
    app.delete('/api/commentStuff/:id',comment.delete);
    app.post('/api/commentStuff',comment.add);
    app.put('/api/commentStuff',comment.add);


    app.get('/api/cakes/:section',cakes.list);
    app.get('/api/cakes/section/:id',cakes.get);

    app.delete('/api/cakes/section/:id',cakes.deleteCake);
    app.post('/api/cakesfile/fileUpload',cakes.fileUpload);
    app.post('/api/cakesfile/fileUploadGallery',cakes.fileUploadGallery);
    app.get('/api/cakesfile/fileGalleryDelete/:id/:index',cakes.fileGalleryDelete);
    app.put('/api/cakes',cakes.add);
    app.post('/api/cakes',cakes.add);


    // All other routes to use Angular routing in app/scripts/app.js
    //app.get('/partials/*', index.partials);
    app.get('/index', middleware.setUserCookie, index.index);
    app.get('/admin123', middleware.requiresLogin, manager.index);
    app.get('/admin123/*', middleware.requiresLogin, manager.index);
    app.get('/*', middleware.setUserCookie, index.index);
};