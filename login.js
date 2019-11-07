 var mysql = require('mysql');
        var express = require('express');
        var session = require('express-session');
        var bodyParser = require('body-parser');
        var admin_id;
        var path = require('path');
        var router=express.Router();
        global.admin_id;
        var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'amit',
        password : '',
        database : 'project1'
        });

        var app = express();
        app.set('html');
        app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
        }));
        app.use(bodyParser.urlencoded({extended : true}));
        app.use(bodyParser.json());
        app.set('views', __dirname + '/view');
        app.use(express.static( __dirname +'/public/css'));
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');
var id;
        app.get('/', function(request, response) {
        response.sendFile(path.join(__dirname + '/login1.html'));

        app.post('/auth', function(request, response) {
            
        username = request.body.username;
        password = request.body.password;
        console.log('logged in status'+request.session.loggedin)

        if (username && password) {
        connection.query('SELECT * FROM EMPLOYEE WHERE ename = ? AND epass = ?', [username, password] , function(error, results, fields) {
        if (results.length > 0) {

           console.log(results);
           request.session.loggedin = true;
           console.log('logged in status'+request.session.loggedin)
           request.session.username = results[0].ename;
           console.log('logged in username '+request.session.username)
           request.session.password=results.password;
           id=results[0].eid;
           
           console.log(username);
           console.log(password);
           console.log(id);
           response.redirect('/home');
        } else {
           response.send('Incorrect Username and/or Password!');
        }        
        // console.log(results.username);

        response.end();
        });
        } else {
        response.send('Please enter Username and Password!');
        response.end();
        }
        });
app.get('/sales', function(req, res) {
  console.log('/sales');
  connection.query('select p.pid,p.pname,sum(o.qty) as QTY_SOLD,p.sprice,p.pprice,sum(o.tprice) as profit from PRODUCTS as p join ORDERLIST as o where o.pid=p.pid group by p.pid ;' , function(error, results, fields) {
    if (error)  throw error;
    console.log(results); 
      res.render('sales.html',{products:results});
      
    });   
  
  });
  app.get('/QTYASC', function(req, res) {
    console.log('/sales');
    connection.query('select p.pid,p.pname,sum(o.qty) as QTY_SOLD,p.sprice,p.pprice,sum(o.tprice) as profit from PRODUCTS as p join ORDERLIST  as o where o.pid=p.pid group by p.pid order by QTY_SOLD asc;' , function(error, results, fields) {
      if (error)  throw error;
      console.log(results); 
        res.render('sales.html',{products:results});
        
      });   
    
    });
    app.get('/QTYDES', function(req, res) {
      console.log('/sales');
      connection.query('select p.pid,p.pname,sum(o.qty) as QTY_SOLD,p.sprice,p.pprice,sum(o.tprice) as profit from PRODUCTS as p join ORDERLIST as o where o.pid=p.pid group by p.pid order by QTY_SOLD desc;' , function(error, results, fields) {
        if (error)  throw error;
        console.log(results); 
          res.render('sales.html',{products:results});
          
        });   
      
      });
      app.get('/PRODES', function(req, res) {
        console.log('/sales');
        connection.query('select p.pid,p.pname,sum(o.qty) as QTY_SOLD,p.sprice,p.pprice,sum(o.tprice) as profit from PRODUCTS as p join ORDERLIST as o where o.pid=p.pid group by p.pid order by profit desc;' , function(error, results, fields) {
          if (error)  throw error;
          console.log(results); 
            res.render('sales.html',{products:results});
            
          });   
        
        });
        app.get('/PROASC', function(req, res) {
          console.log('/sales');
          connection.query('select p.pid,p.pname,sum(o.qty) as QTY_SOLD,p.sprice,p.pprice,sum(o.tprice) as profit from PRODUCTS as p join ORDERLIST as o where o.pid=p.pid group by p.pid order by profit asc;' , function(error, results, fields) {
            if (error)  throw error;
            console.log(results); 
              res.render('sales.html',{products:results});
              
            });   
          
          });
app.get('/delEmp', function(req, res) {
  console.log('/delEmp');
  console.log(req.query['category']);
  connection.query('delete FROM EMPLOYEE WHERE eid=?', req.query['category'] , function(error, results, fields) {
    if(error) throw error;
    console.log(results);
    res.redirect('/rouEmployees');
  
  });
  });
app.get('/customer', function(req, res) {
  console.log('/customer');
  connection.query(' select c.cname,c.contact,sum(ototal) as sum from CUSTOMER as c join ORDERTABLE as o on c.cid=o.cid group by c.cname,c.contact' , function(error, results, fields) {
    if (error)  throw error;
    console.log(results); 

    console.log(results[0].sum);
      res.render('customerdetails.html',{customer:results});
      
    });    
  });
 
app.get('/suppliers', function(req, res) {
  console.log('/suppliers');
  connection.query('select * from SUPPLIER' , function(error, results, fields) {
  if (error)  throw error;
  console.log(results);
  res.render('supplierdeatils.html',{sup:results});
  });});
  router.get('/home', function(request, response) {
        console.log("inside homme");
        console.log('in home user:'+request.session.username);
        var prisoners=[];
        var priso=[];

        // response.sendFile(path.join(__dirname + '/home.html'));
        if (request.session.loggedin) 
        {
        console.log(id);
        connection.query('SELECT * FROM EMPLOYEE where eid= ?',[id],
        function(error, results, fields) {
        console.log(results);
        console.log('wtf is'+id);
        for(var i=0;i<=results.length-1;i++)
        {prisoners.push(results[i]);
                //priso.push(results[i].prisoner_id);
            }
          console.log(prisoners);
          for(var i=0;i<=1;i++)
           console.log(prisoners[i]);   
        response.render('home1.html',{username:username,prisoners:prisoners,sid:prisoners[0].eid});

        });

        } else {
        response.send('Please login to view this page!');

        }
        });
        });
        app.get('/here', function(req, res) {
        console.log('Category: ' + req.query['category']);
        connection.query('SELECT * FROM prisoners WHERE prisoner_id=?', req.query['category'] , function(error, results, fields) {
        res.render('prisoner.html',{prisoner:results});
        });
        });
     
        app.get('/rouInventory', function(req, res) {
        console.log("inside rou inventory");
        connection.query('SELECT * FROM PRODUCTS ', function(error, results, fields) {
         res.render('inve.html',{products:results});
         });

        });
        app.get('/rouCust', function(req, res) {
        console.log("inside roucust");
        res.render('customer.html');
        });
        


   app.post('/addCust',function(request,response){ 
        console.log("inside addCust");
        cname=request.body.cname;
        cadd=request.body.cadd;
        ccont=request.body.ccont;
        eid=id;
        
        
        var res=[];
        if (cname && ccont &&cadd) { 
        console.log("jst before");                                                                                                                           
        connection.query('insert into CUSTOMER values (default,?,?,?,?)', [cname,ccont,cadd,eid] , function(error, results, fields) {
        if(error)console.log(error);
        console.log("cname:"+cname);
         connection.query('select * from CUSTOMER ' ,function(errors,results,fields){
            if(errors)console.log(errors);
            console.log("results cid in customer"+results[results.length-1].cid);
            cid=results[results.length-1].cid;
 connection.query('insert into ORDERTABLE value(default,CURDATE(),?,?,?)',[0,cid,eid], function(error, results, fields){
                if(error)console.log("error");
            });


        });
        });

            response.redirect("/rouOrder");
    }
        else {
        response.send('Please enter Username and Password!');
        response.end();
        }
       // response.render('/rouOrder');
        });


        app.get('/rouOrder',function(request,response){
            var orderList=[];
           console.log("inside rou ouder");
           eid=id;
        connection.query('select * from CUSTOMER ' ,function(errors,results,fields){
            if(errors)console.log(errors);
            console.log("results cid in customer"+results[results.length-1].cid);
            cid=results[results.length-1].cid;
            //console.log("fields customer:"+fields);
           
                connection.query('select * from ORDERTABLE ',function(errors,results,fields){
                if(errors)console.log(errors);
                console.log(results);
            console.log("results oid in customer"+results[results.length-1].oid);
            oid=results[results.length-1].oid;
                    
            connection.query('SELECT * FROM ORDERLIST WHERE oid=? ',[oid],
            function(errors, results, fields) {
             console.log(results);
            for(var i=0;i<=results.length-1;i++)
                {orderList.push(results[i]);
                    //priso.push(results[i].prisoner_id);
             }
        //console.log(prisoners);
         //for(var i=0;i<=1;i++)
                console.log(orderList);  
     var sum;
             connection.query('select *from CUSTOMER',function(errors,results,fields){
                if(errors)console.log(errors);
            console.log("results oid in customer"+oid+" and cid ");
          
          
            response.render('order.html',{sum:sum,orderList:orderList,cid:cid,oid:oid,cname:results[results.length-1].cname,cadd:results[results.length-1].cadd,ccont:results[results.length-1].contact});
response.end();
        }); });
         });
                                
            
           
                })  ;   
       
            
            
        });    




        //      connection.query('SELECT * FROM visitors ', function(error, results, fields) {
        // console.log(results);
     
app.post('/addProdOrder',function(request,response){
           pid=request.body.pid;
           oid=request.body.oid;
           qty=request.body.qty;
           cid=request.body.cid;
           //eid=id;
           var tprice;
           var price;
           console.log("inside addProdOrder");
           console.log("pid is "+pid);
           connection.query('select *from PRODUCTS where pid=?',[pid], function(error, results, fields){
            if(error)console.log('FIRST SELECT '+error);
            console.log('results:'+results[0].sprice);
            tprice=qty*results[0].sprice;
            diff=results[0].pqty-qty;
         
            connection.query('UPDATE PRODUCTS SET pqty=? where pid=?',[diff,pid],function(error,results,fields){
              if(error)console.log(error);
            });
           connection.query('insert into ORDERLIST value(?,?,?,?,?)',[pid,oid,qty,results[0].sprice,tprice], function(error, results, fields){
            if(error)console.log('SELECT SECOND '+error);
            response.redirect('back');  
        response.end(); 
        });   
        });
           
           

          
        });  
app.post('/searchProduct', function(req, res) {
    search=req.body.check;
    attribute=req.body.attribute;
    console.log(search);
    console.log(attribute);

  console.log(search);
  
  console.log(search);
   if(attribute == 'pid'){
    console.log('inside pid');
     connection.query('select * from PRODUCTS where pid=?',[search] , function(error, results, fields) {
        if(error) throw error;
        console.log(results);
    //  if(results==null) popup.alert({content:' no match found'})
        res.render('inve.html',{products:results});
    });
    }
    else if(attribute == 'pname'){
        console.log('inside pname');
         connection.query('select * from PRODUCTS where pname  =?',[search] , function(error, results, fields) {
            if(error) throw error;
            console.log(results);
            res.render('inve.html',{products:results});
        });
        }
        else if(attribute == 'qty'){
            console.log('inside qty');
             connection.query('select * from PRODUCTS where qty>=?',[search] , function(error, results, fields) {
                if(error) throw error;
                console.log(results);
                res.render('inve.html',{products:results});
            });
            }
            else if(attribute == 'cost'){
                  console.log('inside cost');
                  connection.query('select * from PRODUCTS where pprice>=?',[search] , function(error, results, fields) {
                    if(error) throw error;
                    console.log(results);
                    res.render('inve.html',{products:results});
                });
                }
                else if(attribute == 'sprice'){
                    console.log('inside pname');
                     connection.query('select * from PRODUCTS where sprice>=?',[search] , function(error, results, fields) {
                        if(error) throw error;
                        console.log(results);
                        res.render('inve.html',{products:results});
                    });
                    }
                    else if(attribute == 'category'){
                        console.log('inside pname');
                         connection.query('select * from PRODUCTS where category=?',[search] , function(error, results, fields) {
                            if(error) throw error;
                            console.log(results);
                            res.render('inve.html',{products:results});
                        });
                        }
    else{
        console.log('inside default');
        
         connection.query('select * from PRODUCTS ',function(error, results, fields) {
            if(error) throw error;
            console.log(results);
            res.render('inve.html',{products:results});
        });
    }
    });
app.get('/rouSupplier',function(res,res){
    console.log("inside rousupplier");
    connection.query('SELECT * FROM SUPPLIER', function(error, results, fields) {
         res.render('supplier_info.html',{supplier:results});
         });
});
app.post('/searchSupplier', function(req, res) {
    search=req.body.check;
    attribute=req.body.attribute;
    console.log(search);
    console.log(attribute);

   console.log(search);
   if(attribute == 'sid'){
    console.log('inside pid');
     connection.query('select * from SUPPLIER where sid=?',[search] , function(error, results, fields) {
        if(error) throw error;
        console.log(results);
    //  if(results==null) popup.alert({content:' no match found'})
        res.render('supplier_info.html',{supplier:results});
    });
    }
    else if(attribute == 'sname'){
        console.log('inside pname');
         connection.query('select * from SUPPLIER where sname=?',[search] , function(error, results, fields) {
            if(error) throw error;
            console.log(results);
            res.render('supplier_info.html',{supplier:results});
        });
        }
        else if(attribute == 'scontact'){
            console.log('inside contact');
             connection.query('select * from SUPPLIER where scontact=?',[search] , function(error, results, fields) {
                if(error) throw error;
                console.log(results);
                res.render('supplier_info.html',{supplier:results});
            });
            }
                     
    else{
        console.log('inside default');
        
         connection.query('select * from SUPPLIER ',function(error, results, fields) {
            if(error) throw error;
            console.log(results);
            res.render('supplier_info.html',{products:results});
        });
    }
    });
 app.post('/addProdIn',function(request,response){
    console.log("inside add prodIN");
           pqty=request.body.pqty;
          console.log("pqty =",pqty);
           //eid=id;
           var tprice;
           var price;
         
           console.log("pid is "+pid);
           connection.query('select *from PRODUCTS where pid=?',[pid], function(error, results, fields){
            if(error)console.log('FIRST SELECT '+error);
            console.log('results:'+results[0].Mprice);
            tprice=qty*results[0].Mprice;  
           connection.query('insert into ORDERLIST value(?,?,?,?,?)',[pid,oid,qty,results[0].Mprice,tprice], function(error, results, fields){
            if(error)console.log('SELECT SECOND '+error);
            response.redirect('back');  
        response.end(); 
        });   
        });
       });



    

      var ssid;
        app.get('/rousupplyorder',function(request,response){
          ssid=request.query['sid'];
          eid=id;
          var supply=[];
          console.log("ssid "+ssid);
           connection.query('insert into ORDERSUPPLYTABLE value(default,CURDATE(),?,?,?)',[0,ssid,eid], function(error, results, fields){
                if(error)console.log("first"+error);
                response.redirect('/supplyintermediate');
               
         });});;
        app.get('/supplyintermediate',function(req,res){
                  connection.query('SELECT *FROM ORDERSUPPLYTABLE ', function(error, results, fields){
                if(error)console.log("second"+error);
                  oid=results[results.length-1].oid;
                connection.query('SELECT *FROM PRODUCTS WHERE sid=?',[ssid], function(error, results, fields){
                if(error)console.log("thirrd "+error);
                  pid=results[0].pid;
                  console.log("pid sid oid id "+pid+" "+ssid+" "+oid);
       connection.query('SELECT *FROM ORDERSUPPLYLIST WHERE oid=?',[oid], function(error, results, fields){
                if(error)console.log("fourth "+error);
                console.log("supply order "+results);
            res.render("supply_order.html",{pid:pid,sid:ssid,oid:oid,supply:results});
            });


});

 }); 
        });
 app.post('/supplyorderdata',function(req,res){
  qty=req.body.qty;
  pid=req.body.pid;
  sid=req.body.sid;
  oid=req.body.oid;
   console.log(" in supply data pid sid oid id qty"+pid+" "+sid+" "+oid+" "+qty);
  connection.query('select *from PRODUCTS where pid=?',[pid],function(error,results,fields){
    console.log(results);
    tprice=qty*results[0].pprice;
     diff=results[0].pqty+qty;
            if(diff<0) 
            connection.query('UPDATE PRODUCTS SET pqty=? where pid=?',[diff,pid],function(error,results,fields){
              if(error)console.log(error);
            });
console.log("tprce and price"+tprice+" "+results[0].pprice);
  connection.query('insert into ORDERSUPPLYLIST values (?,?,?,?,?)',[pid,oid,qty,results[0].pprice,tprice], function(error, results, fields){
            if(error)console.log('SELECT SECOND '+error);
            
        /*   connection.query('select * from ORDERSUPPLYLIST where oid=?',[oid], function(error, results, fields){
            if(error)console.log('SELECT SECOND '+error);
            console.log("RESULTS IN SUPPLIER"+results[0]);
            oid=results[results.length-1].oid;
          });*/});});
  res.redirect('back');
 });
        
    app.get('/editEmpF', function(req, res) {
    console.log('/editEmp');
    console.log(req.query['category']);
    connection.query('select * from EMPLOYEE WHERE eid=?', req.query['category'] , function(error, results, fields) {
      if(error) throw error;
      console.log(results);
      res.render('editEmp.html',{emp:results});
    });
    });

app.post('/editEmp',function(request,response){
  eid=request.body.eid;
  ename=request.body.ename;
  eadd=request.body.eadd;
  econt=request.body.econt;
  salary=request.body.salary;
  console.log(eid);
  if(ename && eid)
    connection.query('UPDATE EMPLOYEE set ename=? where eid=?',[ename,eid]); 
    if(eadd && eid) 
    connection.query('UPDATE EMPLOYEE set edd=? where eid=?',[eadd,eid]);
  if(econt && eid) 
    connection.query('UPDATE EMPLOYEE set econtact=? where eid=?',[econt,eid]);
  if(salary && eid) 
    connection.query('UPDATE EMPLOYEE set esalary=? where eid=?',[salary,eid]);
     response.redirect('/rouEmployees');
  });



  app.get('/addEmpF',function(request,response){
    response.render('addEmp.html');
  }
  );


  app.post('/addEmp',function(request,response){
    eid=request.body.eid;
    ename=request.body.ename;
    eadd=request.body.eadd;
    econt=request.body.econt;
    salary=request.body.salary;
    pass=request.body.pass;
    connection.query('insert into EMPLOYEE values(?,?,?,?,?,?)', [eid,ename,eadd,econt,salary,pass] , function(error, results, fields) {
      console.log(results);  
       if(error)throw error;
       response.redirect('/rouEmployees')
         });
    });
  
  
app.get('/rouEmployees', function(req, res) {
console.log('/emplyoees');
connection.query('select * from EMPLOYEE', 
  function(error, results, fields) {
    if(error) throw error;
    console.log(results)
      res.render('employees.html',{emp:results});
       });
});
app.get('/rouStats', function(request,response) {
  console.log('/rouStats');
  var date='2019-10-30';
  connection.query('select sum(ototal) as sum from ORDERTABLE where  odate=?', [date] , function(error, results, fields) {
    if (error)  throw error;
    console.log(results[0].sum);
    var betweendate=[];
     response.render('stats.html',{profit:results[0].sum,profit2:null,betweendate:betweendate});
   });
});

app.post('/sendDate', function(request, response) {
  console.log('/senDate')
 // profit =request.body.profit2;
  date = request.body.pdate;
  //console.log(profit);
  console.log(date);
  if (date) {
  connection.query('select sum(ototal) as sum from ORDERTABLE where  odate=?', [date] , function(error, results, fields) {
       if (error)  throw error;
       console.log(results);
       console.log(results[0].sum);
      response.render('stats.html',{profit:results[0].sum});
    });
  } else {
    response.send('Please enter Email Id and Password!');
    response.end();
  }
});
app.post('/roubet', function(request, response) {
  console.log('/roubet')
 fdate =request.body.fdate;
  ldate = request.body.ldate;
  //console.log(profit);
  console.log(fdate+" "+ldate);
  if (fdate && ldate) {
  connection.query('select * from ORDERTABLE WHERE odate BETWEEN ? and ?', [fdate,ldate] , function(error, results, fields) {
       if (error)  throw error;
       console.log(results);
      // console.log();
      response.render('stats.html',{betweendate:results});
    });
  } else {
    response.send('Please enter Email Id and Password!');
    response.end();
  }
});


app.get('/product', function(req, res) {
  console.log('product detail');
  console.log(req.query['category']);
  connection.query('SELECT * FROM PRODUCTS WHERE sid=?', req.query['category'] , function(error, results, fields) {
    if(error) throw error;
    console.log(results);
    res.render('inve.html',{products:results});
  
  });
  });

app.get('/editSupplierF', function(req, res) {
    console.log('/editSupplier');
    console.log(req.query['category']);
    connection.query('select * from SUPPLIER WHERE sid=?', req.query['category'] , function(error, results, fields) {
      if(error) throw error;
      console.log(results);
      res.render('editSupplier.html',{sup:results});
    });
    });

app.post('/editSupp',function(request,response){
  eid=request.body.eid;
  ename=request.body.ename;
  eadd=request.body.eadd;
  econt=request.body.econt;
  salary=request.body.salary;
  console.log(eid);
  if(ename && eid)
    connection.query('UPDATE SUPPLIER set sname=? where sid=?',[ename,eid]); 
    if(eadd && eid) 
    connection.query('UPDATE SUPPLIER set sadd=? where sid=?',[eadd,eid]);
  if(econt && eid) 
    connection.query('UPDATE SUPPLIER set scontact=? where sid=?',[econt,eid]);

     response.redirect('/suppliers');
  });

app.get('/addSupF',function(request,response){
      response.render('addSup.html');
    }
    );
  app.get('/roudone',function(request,response){
  oid=request.query['oid'];
  console.log("oid in roudonw "+oid);
  connection.query('select sum(tprice) as sum from ORDERLIST where oid=? ',[oid],function(errors,results,fields){
    if(errors)console.log(errors);
    console.log(results);
    sum=results[0].sum;
    console.log("sum is "+sum)
    connection.query('UPDATE ORDERTABLE SET ototal=? where oid=?',[sum,oid],function(errors,results,fields){
      if(errors)console.log(errors);
    });
     connection.query('select *from ORDERLIST WHERE oid=? ',[oid],function(errors,results,fields){
    if(errors)console.log(errors);
    console.log(results);
    response.render('bill.html',{orderList:results,sum:sum});
});
  });
  });
  
    app.post('/addSup',function(request,response){
       eid=request.body.eid;
      ename=request.body.ename;
      eadd=request.body.eadd;
      econt=request.body.econt;
      pid=request.body.pid;
      pname=request.body.pname;
      cost=request.body.cost;
      mprice=request.body.mprice;
      category=request.body.category;
      connection.query('insert into SUPPLIER values(?,?,?,?)', [eid,ename,eadd,econt] , function(error, results, fields) {
        console.log('add s'+results);  
         if(error)throw error;
         connection.query('insert into PRODUCTS values(?,?,?,?,?,?,?,?)', [pid,eid,pname,cost,mprice,0,0,category] , function(error, results, fields) {
        console.log('inser'+results);  
         if(error)throw error;
         response.redirect('/suppliers')
        
      });
    });
      });

app.get('/roudone',function(req,res){
  connection.query('UPDATE ORDERTABLE SET ototal=? where oid=?',[ototal,oid],function(errors,results,fields){
    if(errors)console.log(errors);
  });
  res.redirect('/addCust');
});
      app.use('/', router);

        app.listen(8800);