"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const faker = require('faker');
const isEmpty = require('lodash/isEmpty');

const NB_GENERATED_ENTITY = 10;

faker.locale = "fr";

let entityJSON = [{
    uuid: '1234',
    firstName: 'Don Diego',
    lastName: 'De Libercourt',
    civility: 'Mr'
}];


let adressJSON = [{
    uuid: '1234',
    city: faker.address.city()
}];

function createEntity(i){
    return        {
        uuid: '12'+i,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        civility: faker.name.prefix(),
<<<<<<< HEAD
        sex: undefined,
        accountsNames: 'GK',
        date: new Date(),
        style: 'checkbox.true'
    };
}

function createEntityFinance(i){
    return {
        uuid: '12'+i,
        name: faker.finance.accountName(),
        amount: faker.finance.amount(),
        moves: _createFinancialMoves()
=======
        style: 'checkbox.true',
        accountsNames: 'GK',
        date: new Date(),
>>>>>>> save form 6
    };
}

for(let i = 0; i < NB_GENERATED_ENTITY; i++){
    entityJSON.push(createEntity(i));
}

let entityFinanceJSON = [];
for(let i = 0; i < NB_GENERATED_ENTITY; i++){
    entityFinanceJSON.push(createEntityFinance(i));
}

let complexJSON = [];
for(let i = 0; i < NB_GENERATED_ENTITY; i++){
    complexJSON.push(createComplexEntity(i));
}

function _createFinancialMoves(){
    return [0,1,2,3,4,5].map(() => ({
        transactionType: faker.finance.transactionType(),
        amount: faker.finance.amount()
    }));
}

function createComplexEntity(i){
    return {
        user: createEntity(i),
        adress: adressJSON,
        finance: createEntityFinance(i)
    }
}

const MOCKED_API_PORT = process.env.API_PORT || 9999;
/*****************************************
************** Mocked API ****************
******************************************/
const API_ROOT = '/x';
const app = express();

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    console.log(new Date() + ', ' + req.method + ', ' + req.url);
    if (!isEmpty(req.body)) {
        console.log(req.body);
    }
    next();
});

//CORS middleware
const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS,DELETE');
    res.header('Content-Type', 'application/json');
    next();
}

app.use(allowCrossDomain);

app.get(API_ROOT + '/entity', function getAllNotifications(req, res) {
    res.json(entityJSON);
});

app.get(API_ROOT + '/entity/:id', function getSingleEntity(req, res) {
    res.json(entityJSON.find(d => d.uuid === req.params.id));
});

app.get(API_ROOT + '/mixed/:id', function getSingleEntity(req, res) {
    res.json({
        user: entityJSON.find(d => d.uuid === req.params.id),
        address: adressJSON.find(d => d.uuid = req.params.id)
    });
});

app.get(API_ROOT + '/complex/:id', function getSingleEntity(req, res) {
    res.json(complexJSON.find(d => d.user.uuid === req.params.id));
});

//récupération d'un user
app.get(API_ROOT + '/users/:id', function getSingleEntity(req, res) {
    res.json({user: entityJSON.find(d => d.uuid === req.params.id)});
});

//récupération d'une entité finance
app.get(API_ROOT + '/finances/:id', function getSingleFinanceEntity(req, res) {
    res.json({finance: entityFinanceJSON.find(d => d.uuid === req.params.id)});
});

app.get(API_ROOT  + '/complex', (req, res) => {
    res.json(complexJSON);
});

app.put(API_ROOT + '/entity/:id', (req, res) => {
    var savedData = req.body;
    savedData.isSaved = true;
    res.json(savedData);
});

app.post(API_ROOT + '/entity/:id', (req, res) => {
    var savedData = req.body;
    savedData.isSaved = true;
    res.json(savedData);
});

app.get(API_ROOT + '/entity/create', function createNotifs(req, res) {
    entityJSON.push(createEntity())
    res.json(entityJSON);}
);

app.delete(API_ROOT + '/entity', function deleteNotifs(req, res) {
    res.json(JSON.stringify(req.body));
});

app.delete(API_ROOT + '/entity/:id', function deleteNotif(req, res) {
    res.json({id: req.params.id});
});

const server = app.listen(MOCKED_API_PORT, function serverCallback() {
    console.log('Mocked entity API listening at http://localhost:%s', MOCKED_API_PORT);
});

<<<<<<< HEAD
app.get(API_ROOT + '/error', function createNotifs(req, res) {
    res.status(403),
    res.json({
        globalErrors : ['Une erreur globale'],
        "status": 'ERROR'
    })
=======

//https://github.com/get-focus/focus-graph/blob/deliver-version-3.2.0/api/index.js
app.get(API_ROOT  + '/error', function createNotifs(req, res) {
    res.status(403);
    res.json({"globalErrors":[" Libelle doit être renseigné"], "status": 'ERROR'})
>>>>>>> save form 6
});
