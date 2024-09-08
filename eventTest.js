const { log } = require('util')
const logEvents=require('./jsIdGenerator')
const EventEmitter=require('events')
class myEmitter extends EventEmitter{}
const myEmitter1=new myEmitter()
myEmitter1.on('log',(msg)=>
{
    logEvents(msg);
})
myEmitter1.emit('log','log event emitted!')