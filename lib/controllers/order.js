'use strict';


var mongoose = require('mongoose'),
    nodemailer = require("nodemailer"),
    User = mongoose.model('User'),
    moment = require('moment'),
    _=require('underscore'),
    Order = mongoose.model('Order'),
    config=require("../../data/config.json"),
    Chat=mongoose.model('Chat'),
    async=require('async'),
    OrderArch = mongoose.model('OrderArch');

var order = function(chatRoom){
    this.list= function(req, res) {
       /*var query = (req.query.user)?{'user':req.query.user}:null;
        var query = (req.query.retail)?{'quantity':{"$lt":5}}:{'quantity':{"$gte":5}};*/
       var query=null;
       if (req.query.user){
           query = {'user':req.query.user};
       } else if (req.query.retail) {
           query ={'quantity':{"$lt":5}};
       } else {
           if (req.user.role=='admin_order'){
               if (req.user.email==config.email.optUA){
                   query = {'quantity':{"$gte":5},'country':'UA'};
               } else {
                   query = {'quantity':{"$gte":5},'country':"ELSE"};
               }
           } else {
               query = {'quantity':{"$gte":5}}
           }



       }
        //console.log(query);
       //console.log(req.query.retail);
       Order.find(query)
           .populate('user', 'email name')
           .sort('-num')
           //.select('name index country region')
           .exec(function (err, result){
               if (err)
                   return res.json(err);
               else {

                   return res.json(result);
               }
           })
        },
    this.get= function(req, res) {
           //console.log(req.body);
           Order.findById(req.params.id)

               .exec(function (err, result) {

                   if (err) return res.json(err);

                   res.json(result);})


       },
    this.delete = function(req,res){
           Order.findByIdAndRemove(req.params.id, function (err,doc) {
               if (err) {console.log(err);return res.json(err);}

               res.json({});
           })
       },

    this.add = function(req, res) {
        //console.log('chatRoom.length ='+chatRoom.length);
//http://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose
//How do I update/upsert a document in Mongoose?
        var date= Date.now();
           //console.log(date);
        /*for  (var i=1;i<4000000000;i++){
            var j = i*2;
        }
        var date1= Date.now();
        console.log(date1-date);*/
           var order = new Order(req.body);
//console.log(order);
           var upsertData = order.toObject();
           delete upsertData._id;
           //console.log(upsertData);

           Order.getLastNumberOrder(function(err,lastOrder){
               //console.log(lastOrder);
               //res.json({});
               if(!lastOrder[0] || !lastOrder[0].num){
                   if (!upsertData.num){
                       upsertData.num=2455;
                   }
               }else {
                   if (!upsertData.num){
                       upsertData.num=++lastOrder[0].num;
                   }
               }


               if (upsertData.status==6 && !upsertData.date4){
                   upsertData.date4=Date.now();
                   var orderArch = new OrderArch(upsertData);
                   orderArch.save(function (err) {
                       if (err) return res.json(err);
                       // saved!
                       Order.findByIdAndRemove(order.id,function(err,order){
                           console.log('aaaa'+order);
                           res.json({});
                       })
                   })


               } else {
                   if (upsertData.status==2){
                       sendEmail(upsertData);
                   }
                   if (upsertData.status==3 && !upsertData.date1){
                       upsertData.date1=Date.now();
                   }
                   if (upsertData.status==4 && !upsertData.date2){
                       upsertData.date2=Date.now();
                   }
                   if (upsertData.status==5 && !upsertData.date3){
                       upsertData.date3=Date.now();
                   }
                   Order.update({_id: order.id}, upsertData, {upsert: true}, function (err) {
                       if (err) {console.log(err);return res.json(err);}
                       if (!req.body._id){
                           createMail(req.body.address)
                       } else {
                           res.json({});
                       }

                   })
               }

           });

           //*******************************mail
           function sendEmail(order){ // after status 2
               User.findById(order.user).exec(function (err,user){
                   if (err) {console.log(err);return;}
                   var dateForTable= Date.now();
                   var smtpTransport = nodemailer.createTransport("SMTP",{
                       service: "Mailgun",
                       auth: {
                           user: "postmaster@sandbox86422.mailgun.org",
                           pass: "9zsllp27ndo6"
                       }
                   });
                   var mailOptions = {
                       from: "noreplay ✔ <noreplay@jadone.biz>", // sender address
                       //to: req.body.useremail, // list of receivers
                       subject: "order update✔", // Subject line
                       //text: "Hello world ✔", // plaintext body
                       html:""
                   }
                   var  message =

                       '<table width="100%" border="1px" style="border-color: #ccc;">'+
                           ' <tbody>'+
                           '  <tr>'+
                           '   <td style="background-color: #999;">#</td><td style="background-color: #999">Категория</td><td style="background-color: #999">Артикул</td><td style="background-color: #999">Размер</td><td style="background-color: #999">Цена</td><td style="background-color: #999">Кол-во</td><td style="background-color: #999">Сумма</td>'+
                           '  </tr>'+
                           ' </tbody>'+
                           ' <tbody>';
                   upsertData['cart'].forEach(function(good,index){
                       message +=
                           '<tr>'+
                               '<td>'+(++index)+'</td><td>'+good.categoryName+'</td><td>'+good['name']+' '+good['colorName']+'</td><td>'+good['sizeName']+'</td>';
                       var sum = (upsertData.quantity>=5)?good.price:good.retail;
                       message +=
                           '<td>'+(upsertData.kurs* sum).toFixed(2)+' '+upsertData.currency+'</td><td>'+good['quantity']+'</td>';
                       message +=
                           '<td>'+(upsertData.kurs* sum*good['quantity']).toFixed(2)+' '+upsertData.currency+'</td>'+
                               '</tr>';
                   })
                   //sumAll.toFixed(2);
                   message +=
                       '</tbody>'+
                           '<tbody>'+
                           '<tr>'+
                           '<td></td>'+
                           '<td>Итого</td>'+
                           '<td></td>'+
                           '<td></td>'+
                           '<td></td>'+
                           '<td>'+upsertData.quantity+'</td>'+
                           '<td>'+(upsertData.sum*upsertData.kurs).toFixed(2)+' '+upsertData.currency+'</td>'+
                           '</tr>'+
                           '</tbody></table>'+
                           '<table width="100%">'+
                           '<tr>'+
                           '<td>'+
                           '<h5>Данные для доставки</h5>'+
                           'ФИО : '+user.profile['fio']+'<br>'+
                           'индекс : '+user.profile['zip']+'<br>'+
                           'cтрана : '+user.profile['country']+'<br>'+
                           'регион : '+user.profile['region']+'<br>'+
                           'город : '+user.profile['city']+'<br>'+
                           'адрес : '+user.profile['address']+
                           '</td>'+
                           '<td>'+
                           '<h5>Контактная информация</h5>'+
                           'телефон : '+user.profile['phone']+'<br>'+
                           'e-mail  : '+user['email']+'<br>'+
                           'login: '+userm['name']+'<br>'+
                           'комментарий  : '+upsertData['comment']+'<br>'+
                           '</td>'+
                           '</tr>'+
                           '<tr>'+
                           '<td colspan="2" style="background-color:#999"></td>'+
                           '</tr>'+
                           '</table>';
                   var end1 =
                       '</body>'+
                           '</html>';

                   var end2=
                       //'Менеджер свяжется с Вами в ближайшее время.'+ //  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                       '</body>'+
                           '</html>';
                   var messageBegin1=
                       '<html>'+
                           '<body bgcolor="#D4D4D4" topmargin="25">'+
                           '<h3>Здравствуйте</h3>'+
                           '<p>Заказ на сайте <a href="http://jadone.biz">jadone.biz</a> откорректирован, уточнен и принят к выполнению.</p>'+
                           '<p>Номер заказа: '+upsertData.num+'</p>'+
                           'Дата : '+moment(dateForTable).format('LLL')+'<br>';

                   var messageBegin2=
                       '<html>'+
                           '<body bgcolor="#D4D4D4" topmargin="25">'+
                           '<h3>Здравствуйте!</h3>'+
                           '<p>Ваш заказ на сайте <a href="http://jadone.biz">jadone.biz</a> оформлен и принят к выполнению.</p>'+

                           '<p>Номер заказа: '+upsertData.num+'</p>'+
                           'Дата : '+moment(dateForTable).format('LLL')+'<br>';
                   mailOptions.html=messageBegin2+message+end2;
                   mailOptions.to=user.email;
                   smtpTransport.sendMail(mailOptions, function(error, response){
                       if(error){
                           console.log(error);
                       }else{
                           console.log("Message sent: " + response.message);
                       }
                       mailOptions.html=messageBegin1+message+end1;
                       //console.log('2');
                       //mailOptions.to='jadoneopt@gmail.com';
                       if (upsertData.quantity<5){
                           mailOptions.to=config.email.retail;
                       } else {
                           mailOptions.to=config.email.opt;
                       }

                       smtpTransport.sendMail(mailOptions, function(error, response){
                           //console.log('3');
                           if(error){
                               console.log(error);
                           }else{
                               console.log("Message sent: " + response.message);
                           }
                           //res.json({});

                           // if you don't want to use this transport object anymore, uncomment following line
                           smtpTransport.close(); // shut down the connection pool, no more messages
                       });

                   });


               })

           }
            /*function trim1 (str) {
                if (typeof(str)=='object'){
                    str.toString();
                }
                str.toHexString();
                console.log('aaaa'+ typeof(str));
                return str;
                str.replace(/^\s\s*//*, '').replace(/\s\s*$/, '');
            }*/
           function createMail(user){ //first email
               var dateForTable=upsertData.date;
               var smtpTransport = nodemailer.createTransport("SMTP",{
                   service: "Mailgun",
                   auth: {
                       user: "postmaster@sandbox86422.mailgun.org",
                       pass: "9zsllp27ndo6"
                   }
               });
               var mailOptions = {
                   from: "noreplay ✔ <noreplay@jadone.biz>", // sender address
                   //to: req.body.useremail, // list of receivers
                   subject: "order ✔", // Subject line
                   //text: "Hello world ✔", // plaintext body
                   html:""
               }
               //onsole.log(order.user);
               User.findById(order.user)
                   .exec(function(err,userm){

                       // chat ********************************
                       var mailChat=config.email.opt;
                       if (upsertData.quantity<5){ // retail
                           mailChat=config.email.retail;
                       } else if(user['country'] && user['country'].toLowerCase()=="украина") { // UA opt
                           mailChat=config.email.optUA;
                           //upsertData.country='UA';
                       } else { // OPT

                       }
                       //console.log(upsertData);
                       User.findOne({email:mailChat}).exec(function(err,manager){
                           //console.log('manager -'+manager);
                           if (manager && !manager._id.equals(userm._id)){
                               var query={ $and: [ { members:userm._id  }, {members:manager._id} ] };
                                console.log(manager._id);
                                console.log(userm._id);
                               Chat.findOne(query,function (err, chat) {
                                   //console.log('chat -'+chat);
                                   if (err) throw err;
                                   if (!chat){
                                       chat= new Chat({members:[userm._id,manager._id]});

                                   }
                                   var date = Date.now();
                                   var opt = (upsertData.quantity>=5)?true:false;
                                   var msg='Оформлен заказ по ';
                                   msg +="<a ng-click=\"goToOrder('"+upsertData.num +"','"+manager._id +"','"+opt +"')\">ордеру N "+upsertData.num+"</a></br>";
                                   msg +='сумма - '+(upsertData.sum*upsertData.kurs).toFixed(2)+' '+upsertData.currency;
                                   msg +=', в количестве - '+upsertData.quantity+'</br>';
                                   msg +='заказчик - '+user['fio']+'</br>';
                                   msg +='ствана -'+user['country']+'</br>';
                                   msg +='город -'+user['city'];
                                   chat.chat.push({user:userm._id,msg:msg,date:date});
                                   chat.save();
                                   sendSocketMsg(userm._id,manager._id,msg,date,chat);
                               })
                           }


                       })
                       //**************************************
                       // console.log(user);
                       var  message =

                           '<table width="100%" border="1px" style="border-color: #ccc;">'+
                               ' <tbody>'+
                               '  <tr>'+
                               '   <td style="background-color: #999;">#</td><td style="background-color: #999">Категория</td><td style="background-color: #999">Артикул</td><td style="background-color: #999">Размер</td><td style="background-color: #999">Цена</td><td style="background-color: #999">Кол-во</td><td style="background-color: #999">Сумма</td>'+
                               '  </tr>'+
                               ' </tbody>'+
                               ' <tbody>';
                       upsertData['cart'].forEach(function(good,index){
                           message +=
                               '<tr>'+
                                   '<td>'+(++index)+'</td><td>'+good.categoryName+'</td><td>'+good['name']+' '+good['colorName']+'</td><td>'+good['sizeName']+'</td>';
                           var sum = (upsertData.quantity>=5)?good.price:good.retail;
                           message +=
                               '<td>'+(upsertData.kurs* sum).toFixed(2)+' '+upsertData.currency+'</td><td>'+good['quantity']+'</td>';
                           message +=
                               '<td>'+(upsertData.kurs* sum*good['quantity']).toFixed(2)+' '+upsertData.currency+'</td>'+
                                   '</tr>';
                       })
                       //sumAll.toFixed(2);
                       message +=
                           '</tbody>'+
                               '<tbody>'+
                               '<tr>'+
                               '<td></td>'+
                               '<td>Итого</td>'+
                               '<td></td>'+
                               '<td></td>'+
                               '<td></td>'+
                               '<td>'+upsertData.quantity+'</td>'+
                               '<td>'+(upsertData.sum*upsertData.kurs).toFixed(2)+' '+upsertData.currency+'</td>'+
                               '</tr>'+
                               '</tbody></table>'+
                               '<table width="100%">'+
                               '<tr>'+
                               '<td>'+
                               '<h5>Данные для доставки</h5>'+
                               'ФИО : '+user['fio']+'<br>'+
                               'индекс : '+user['zip']+'<br>'+
                               'cтрана : '+user['country']+'<br>'+
                               'регион : '+user['region']+'<br>'+
                               'город : '+user['city']+'<br>'+
                               'адрес : '+user['address']+
                               '</td>'+
                               '<td>'+
                               '<h5>Контактная информация</h5>'+
                               'телефон : '+user['phone']+'<br>'+
                               'e-mail  : '+userm['email']+'<br>'+
                               'login: '+userm['name']+'<br>'+
                               'комментарий  : '+upsertData['comment']+'<br>'+
                               '</td>'+
                               '</tr>'+
                               '<tr>'+
                               '<td colspan="2" style="background-color:#999"></td>'+
                               '</tr>'+
                               '</table>';
                       var end1 =
                           '</body>'+
                               '</html>';

                       var end2=
                           'Менеджер свяжется с Вами в ближайшее время.'+
                               '</body>'+
                               '</html>';
                       var messageBegin1=
                           '<html>'+
                               '<body bgcolor="#D4D4D4" topmargin="25">'+
                               '<h3>Здравствуйте</h3>'+
                               '<p>Поступил заказ с сайта <a href="http://jadone.biz">jadone.biz.</a></p>'+
                               '<p>Номер заказа: '+upsertData.num+'</p>'+
                               'Дата : '+moment(upsertData.date).format('LLL')+'<br>';

                       var messageBegin2=
                           '<html>'+
                               '<body bgcolor="#D4D4D4" topmargin="25">'+
                               '<h3>Здравствуйте!</h3>'+
                               '<p>С Вашего адреса на сайте<a href="http://jadone.biz"> jadone.biz</a> оформлен следующий заказ:</p>'+
                               '<p>Номер заказа: '+upsertData.num+'</p>'+
                               'Дата : '+moment(upsertData.date).format('LLL')+'<br>';

                       //res.json({});

                       /*
                        mailOptions.html=messageBegin2+message+end2;
                        mailOptions.to=userm.email;
                       smtpTransport.sendMail(mailOptions, function(error, response){
                           if(error){
                               console.log(error);
                           }else{
                               console.log("Message sent: " + response.message);
                           }
                           mailOptions.html=messageBegin1+message+end1;
                           //console.log('2');
                           //mailOptions.to='jadoneopt@gmail.com';
                           if (upsertData.quantity<5){
                               mailOptions.to=config.email.retail;
                           } else {
                               mailOptions.to=config.email.opt;
                           }
                           mailOptions.to=mailChat;
                          // console.log(mailOptions.to);
                           //mailOptions.to='ig19chin@gmail.com';
                           smtpTransport.sendMail(mailOptions, function(error, response){
                               smtpTransport.close(); // shut down the connection pool, no more messages
                               if(error){
                                   console.log(error);
                                   res.json(error);
                               }else{
                                   console.log("Message sent: " + response.message);
                                   res.json({});
                               }
                           });

                       });*/


                       async.series([
                           function(callback){
                               mailOptions.html=messageBegin2+message+end2;
                               mailOptions.to=userm.email;
                               smtpTransport.sendMail(mailOptions, function(error, response){
                                       if(error){
                                           callback(error);
                                       }else{
                                           callback(null);
                                       }
                               });
                           },
                           function(callback){
                               mailOptions.html=messageBegin1+message+end1;
                               mailOptions.to=mailChat;
                               smtpTransport.sendMail(mailOptions, function(error, response){
                                   if(error){
                                       callback(error);
                                   }else{
                                       callback(null);
                                   }
                               });
                           }
                       ],
                           function(err, results){
                               smtpTransport.close(); // shut down the connection pool, no more messages
                               if (err)
                                   res.json(err)
                               else
                                   res.json({});
                           });

                   })

           }

       }

    function sendSocketMsg(from,to,msg,date,chat){
        function wherefoo(a,o){
            var t=[];
            for (var i= 0,l= a.length;i<l;i++){
                for (var k in o ){
                    if (a[i][k] && a[i][k]==o[k]){
                        t[t.length]=a[i];
                    }
                }
            }
            return t;
        }
        /*console.log('from-'+from);
        console.log('nickname-'+chatRoom[0].nickname);
        console.log('nickname-'+chatRoom[1].nickname);*/
        var a = wherefoo(chatRoom,{nickname:to});
        var b = wherefoo(chatRoom,{nickname:from});
        console.log('a.length-'+a.length);
        console.log('b.length-'+b.length);
        _.each(b,function(chat){

            chat.emit('new:msg',{msg:msg,date:date,from:from,to:to},function(res){
                console.log(res);
            })
        })
        var arr =[];
        _.each(a,function(chat){
            var c = function(cb){
                chat.emit('new:msg',{msg:msg,date:date,from:from,to:to},function(res){
                    cb(null,res);
                })
            }
            arr.push(c);
        })
        var read=false;
        async.parallel(arr,function(err,result){
            for(var i=0;i<result.length;i++){
                if(result[i].status){
                    read=true;
                    break;
                }
            }
            //console.log('result-'+result);
            if (read){
                chat.chat[chat.chat.length-1].status=[to];
                chat.save();
            }/* else{
             _.each(a,function(chat){
             chat.emit('notRead:msg',{from:from}); // send message about don't read message
             })
             }*/
            //callback(true);
        })

    }


}



module.exports = order;




