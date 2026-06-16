const fs=require('fs')
const path=require('path')
const rs=fs.createReadStream(path.join(__dirname,'myFiles','test.txt'),{encoding:'utf-8'})
const ws=fs.createWriteStream(path.join(__dirname,'myFiles','test4.txt'))
rs.on('data',(datachunk) =>{
ws.write(datachunk)
})