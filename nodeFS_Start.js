//import { error } from 'node:console'  
//import {readFile} from 'node:fs'  ES 6 module, for Es6 module only work .mjs  filr or type:module in package.json
const fs=require('fs')
const path=require('path')
/* readFile('./myfiles/test.txt',(err,data)=>
{
    if (err) throw error;
    console.log(data.toString())
});  */
console.log(__dirname)
fs.readFile(path.join(__dirname,'myfiles','test.txt'),'utf-8',(err,data)=>
{
    if (err) throw error;
    console.log(data)
}); 
fs.writeFile(path.join(__dirname,'myfiles','test1.txt'),'testing',(err)=>
{
    if (err) throw error;
    console.log("loaded")
}); 
fs.appendFile(path.join(__dirname,'myfiles','test1.txt'),'\n\n thankyou',(err)=>
{
    if (err) throw error;
    console.log("appended")
}); 
fs.rename(path.join(__dirname,'myfiles','test1.txt'),path.join(__dirname,'myfiles','test2.txt'),(err)=>
{
    if (err) throw error;
    console.log("rename completed")
}); 
process.on('uncaughtException',err=>{
console.error('exception,${err}')
})