const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const fs = require('fs');
const formidable = require('express-formidable');
const mongourl = 'mongodb+srv://tonyc-mu:lTbnfXDDLesvViS8@cluster0.dwmycn2.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'test';
const bodyParser = require('body-parser');
const session = require('cookie-session');

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SECRETKEY = '381hardware';

var usersinfo = new Array(
    {name: "tony-hkmu", password: "s381f"},
    {name: "admin1", password: "admin"},
    {name: "assistant", password: "assistant"}
);

app.use(session({
    userid: "session",  
    keys: [SECRETKEY],
}));

var documents = {};

// --CRUD Operations & Login--
const createDocument = function(db, createddocuments, callback){
    const client = new MongoClient(mongourl);
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connection to inventory database successful.");
        const db = client.db(dbName);

        db.collection('inventories').insertOne(createddocuments, function(error, results){
            if(error){
            	throw error
            };
            console.log(results);
            return callback();
        });
    });
}

const deleteDocument = function(db, criteria, callback){
    console.log(criteria);
    db.collection('inventories').deleteOne(criteria, function(err, results){
	assert.equal(err, null);
	console.log(results);
	return callback();
    });
};

const handle_Delete = function(res, criteria) {
    const client = new MongoClient(mongourl);
    client.connect(function(err) {
        console.log("Connection to inventory database successful.");
        const db = client.db(dbName);
	
	let deldocument = {};
	
        deldocument["_id"] = ObjectID(criteria._id);
        console.log(deldocument["_id"]);
        
        deleteDocument(db, deldocument, function(results){
            client.close();
            console.log("Database connection ended.");
            res.status(200).render('info', {message: "Item deleted."});
        })     
    });
}

const updateDocument = (criteria, updateDoc, callback) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connection to inventory database successful.");
        const db = client.db(dbName);

         db.collection('inventories').updateOne(criteria,
            {
                $set : updateDoc
            },
            (err, results) => {
                client.close();
                assert.equal(err, null);
                callback(results);
            }
        );
    });
}

const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('inventories').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });
}

const handle_Find = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connection to inventory database successful.");
        const db = client.db(dbName);

        findDocument(db, criteria, (docs) => {
            client.close();
            console.log("Database connection ended.");
            res.status(200).render('list',{nInventories: docs.length, inventories: docs});
        });
    });
}

const handle_Details = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connection to inventory database successful.");
        const db = client.db(dbName);

        let DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
        findDocument(db, DOCID, (docs) => { 
            client.close();
            console.log("Database connection ended.");
            res.status(200).render('details', {inventories: docs[0]});
        });
    });
}

const handle_Edit = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connection to inventory database successful.");
        const db = client.db(dbName);

        let DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
        let cursor = db.collection('inventories').find(DOCID);
        cursor.toArray((err,docs) => {
            client.close();
            assert.equal(err,null);
            res.status(200).render('edit',{inventories: docs[0]});
        });
    });
}

app.get('/', function(req, res){
    if(!req.session.authenticated){
        console.log("Please verify yourself. System not in use.");
        res.redirect("/login");
    }else{
    	res.redirect("/login");
    }
});

app.get('/login', function(req, res){
    return res.status(200).render("login");
});

app.post('/login', function(req, res){
    console.log("Loading.");
    for (var i=0; i<usersinfo.length; i++){
        if (usersinfo[i].name == req.body.username && usersinfo[i].password == req.body.password) {
            req.session.authenticated = true;
            req.session.userid = usersinfo[i].name;
            console.log("Session in use by: " + req.session.userid);
            return res.status(200).redirect('/menu');
        }
    }
    console.log("Incorrect login credentials. Access denied.");
    return res.redirect("/");
});

app.get('/logout', function(req, res){
    console.log(req.session.userid + " has logged out.");
    req.session = null;
    req.authenticated = false;
    res.redirect('/login');
});

app.get('/menu', function(req, res){
    res.render('menu');
});

app.get('/find', (req,res) => {
    handle_Find(res, req.query.docs);
})

app.get('/checkmenu', function(req, res){
    res.render('search_menu');
})

app.get('/check1', function(req, res){
    res.render('search');
})

app.get('/check2', function(req, res){
    res.render('search2');
})

app.get('/check3', function(req, res){
    res.render('search3');
})

app.get('/create', function(req, res){
    return res.status(200).render("create");
});

app.post('/create', function(req, res){
    const client = new MongoClient(mongourl);
    client.connect(function(err){
        assert.equal(null, err);
        console.log("Connection to inventory database successful.");
        const db = client.db(dbName);
        var hardware = {};
        hardware["_id"] = ObjectID;  
	hardware["product_id"] = req.body.product_id;       
	hardware['category'] = req.body.category;	
	hardware['hardware_name']= req.body.hardware_name;
	hardware['release_year']= req.body.release_year;
        hardware['price']= req.body.price;
        console.log("Storing data.");
        
        if(hardware.category !== null && hardware.hardware_name !== null){
            console.log("Creating new item.");
            createDocument(db, hardware, function(docs){
                client.close();
                console.log("Database connection ended.");
                return res.status(200).render('info', {message: "Item Successfully Created."});
            });
        } else if (hardware.category !== null && hardware.hardware_name !== null){
            client.close();
            console.log("Database connection ended.");
            return res.status(200).render('info', {message: "Invalid data."});
        }
    });
});

app.post('/search', function(req, res){
    const client = new MongoClient(mongourl);
    client.connect(function(err){
        assert.equal(null, err);
        console.log("Connection to inventory database successful.");
        const db = client.db(dbName);
    
    var searchID={};
    searchID['product_id'] = req.body.product_id;
    if (searchID.product_id){
    console.log("Checking for related items.");
    findDocument(db, searchID, function(docs){
            client.close();
            console.log("Database connection ended.");
            res.status(200).render('list', {nInventories: docs.length, inventories: docs});
        });
    }
    else{
    console.log("No available results. Try again.");
    res.status(200).redirect('/find');
    }         	
	});
});

app.post('/search2', function(req, res){
    const client = new MongoClient(mongourl);
    client.connect(function(err){
        assert.equal(null, err);
        console.log("Connection to inventory database successful.");
        const db = client.db(dbName);
    
    var searchID={};
    searchID['category'] = req.body.category;
    if (searchID.category){
    console.log("Checking for related items.");
    findDocument(db, searchID, function(docs){
            client.close();
            console.log("Database connection ended.");
            res.status(200).render('list', {nInventories: docs.length, inventories: docs});
        });
    }
    else{
    console.log("No available results. Try again.");
    res.status(200).redirect('/find');
    }         	
	});
});

app.post('/search3', function(req, res){
    const client = new MongoClient(mongourl);
    client.connect(function(err){
        assert.equal(null, err);
        console.log("Connection to inventory database successful.");
        const db = client.db(dbName);
    
    	var searchID={};
    	searchID['release_year'] = req.body.release_year;
    	if (searchID.release_year){
    	    console.log("Checking for related items.");
    	    findDocument(db, searchID, function(docs){
            	client.close();
            	console.log("Database connection ended.");
            	res.status(200).render('list', {nInventories: docs.length, inventories: docs});
            });
    	}
    	else{
    	    console.log("No available results. Try again.");
    	    res.status(200).redirect('/find');
    	}         	
    });
});


app.get('/details', (req,res) => {
    handle_Details(res, req.query);
})

app.get('/edit', (req,res) => {
    handle_Edit(res, req.query);
})

app.post('/update', function(req, res){
    var updatedocument={};
    const client = new MongoClient(mongourl);
        client.connect(function(err){
            assert.equal(null, err);
            console.log("Connection to inventory database successful.");
            
            if(req.body.category){
		updatedocument["product_id"] = req.body.product_id;  
                updatedocument['category']= req.body.category;
                updatedocument['hardware_name']= req.body.hardware_name;
                updatedocument['release_year']= req.body.release_year;
                updatedocument['price']= req.body.price;

        	let updateDoc = {};
                updateDoc['_id'] = ObjectID(req.body._id);
                console.log(updateDoc);

                updateDocument(updateDoc, updatedocument, function(docs) {
                    client.close();
                    console.log("Database connection ended.");
                    return res.render('info', {message: "Item Successfully Updated."});
                    
                })
            }
            else{
            	return res.render('info', {message: "Invalid data."});
            }
    }); 
});

app.get('/delete', function(req, res){
    console.log("Request Processing.");
    handle_Delete(res, req.query);
});

app.get('/*', (req,res) => {
    res.status(404).render('info', {message: `${req.path} - unknown request.` });
})

// --Restful--
// Insert:
app.post('/api/inventories/:product_id', (req,res) => {
    if (req.params.product_id) {
        console.log(req.body)
        const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null,err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);
            let newDoc = {};
            newDoc['category'] = req.body.category;
            newDoc['hardware_name'] = req.body.hardware_name;
    	    newDoc['release_year'] = req.body.release_year;
            newDoc['price'] = req.body.price;
	    newDoc['product_id'] = req.body.product_id;
	    db.collection('inventories').insertOne(newDoc,(err,results) => {
		assert.equal(err,null);
		client.close()
		res.status(200).json({"Successfully inserted":newDoc}).end();
                    })
                });
    } else {
        res.status(500).json({"error": "Incomplete information!"});
    }
})

// Update:
app.put('/api/inventories/:product_id', (req,res) => {
    if (req.params.product_id) {
        console.log(req.body)
        const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null,err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);
            let criteria = {}
            criteria['product_id'] = req.params.product_id;
            let updateDoc = {};
            updateDoc['price'] = req.body.price;
            updateDoc['release_year'] = req.body.release_year;
            console.log(updateDoc)
                db.collection('inventories').updateOne(criteria, {$set: updateDoc},(err,results) => {
                    assert.equal(err,null);
                    client.close()
                    res.status(200).json("Successfully updated.").end();
                })
        })
    } else {
        res.status(500).json({"error": "Incomplete information!"});
    }
})

// Delete by Product ID:
app.delete('/api/inventories/:product_id', function(req,res){
    if (req.params.product_id) {
        let criteria = {};
        criteria['product_id'] = req.params.product_id;
        const client = new MongoClient(mongourl);
        client.connect(function(err){
            assert.equal(null, err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);

            db.collection('inventories').deleteOne(criteria, function(err,results) {
                assert.equal(err,null)
                client.close()
                res.status(200).json("Successfully deleted.").end();
            })
        });
    } else {
        res.status(500).json({"error": "Product ID not found!"});       
    }
})

// Delete by Year:
app.delete('/api/inventories/release_year/:release_year', function(req,res){
    if (req.params.release_year) {
        let criteria = {};
        criteria['release_year'] = req.params.release_year;
        const client = new MongoClient(mongourl);
        client.connect(function(err){
            assert.equal(null, err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);

            db.collection('inventories').deleteMany(criteria, function(err,results) {
                assert.equal(err,null)
                client.close()
                res.status(200).json("Successfully deleted.").end();
            })
        });
    } else {
        res.status(500).json({"error": "Year not found!"});       
    }
})

app.listen(app.listen(process.env.PORT || 8099));
