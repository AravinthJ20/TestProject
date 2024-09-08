const express=require('express')
const app=express()
const fs=require('fs').promises
const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient;
const path=require('path')

const pipeline= [
    {
      "$match": {
        "$and": [
          {
            "externalDeliveryID": "894001744163845"
          }
        ]
      }
    },
    {
      "$lookup": {
        "from": "shipmentCost",
        "localField": "shipmentNumber",
        "foreignField": "item.refDocNo",
        "as": "costDetail"
      }
    },
    {
      "$unwind": {
        "path": "$costDetail",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      "$unwind": {
        "path": "$costDetail.item",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      "$unwind": {
        "path": "$costDetail.item.item",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      "$lookup": {
        "from": "vendors",
        "let": {
          "costDetailAgent": "$costDetail.item.serviceAgent"
        },
        "pipeline": [
          {
            "$match": {
              "$expr": {
                "$and": [
                  {
                    "$eq": [
                      "$sapAssociateNumber",
                      "$$costDetailAgent"
                    ]
                  },
                  {
                    "$eq": [
                      "$active",
                      true
                    ]
                  }
                ]
              }
            }
          },
          {
            "$project": {
              "_id": 0
            }
          }
        ],
        "as": "vendr"
      }
    },
    {
      "$unwind": {
        "path": "$vendr",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      "$addFields": {
        "vend1": "VEND3621"
      }
    },
    {
      "$lookup": {
        "from": "vendors",
        "localField": "vend1",
        "foreignField": "userId",
        "as": "vendr1"
      }
    },
    {
      "$unwind": {
        "path": "$vendr1",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      "$match": {
        "$and": [
          {
            "$expr": {
              "$eq": [
                "$costDetail.item.serviceAgent",
                "$vendr1.sapAssociateNumber"
              ]
            }
          },
          {
            "costDetail.item.netValue": {
              "$gt": 0
            }
          }
        ]
      }
    },
    {
      "$addFields": {
        "totalAmt": {
          "$round": [
            "$costDetail.item.netValue",
            0
          ]
        }
      }
    },
    {
      "$group": {
        "_id": "$_id",
        "vendr1": {
          "$first": "$vendr1.sapAssociateNumber"
        },
        "item": {
          "$first": "$costDetail.item.item"
        },
        "descforRef": {
          "$first": "$costDetail.item.descforRef"
        },
        "itemCatg": {
          "$first": {
            "$concat": [
              "$costDetail.item.itemCatg",
              " - ",
              "$costDetail.item.itemCatDesc"
            ]
          }
        },
        "itemCatDesc": {
          "$first": "$costDetail.item.itemCatDesc"
        },
        "totalAmt": {
          "$first": "$totalAmt"
        },
        "netValue": {
          "$first": "$costDetail.item.netValue"
        },
        "currency": {
          "$first": "$costDetail.item.currency"
        },
        "serviceAgent": {
          "$first": {
            "$concat": [
              {
                "$toString": {
                  "$toInt": "$costDetail.item.serviceAgent"
                }
              },
              " - ",
              "$vendr.organisationName"
            ]
          }
        },
        "vendr": {
          "$first": "$vendr.organisationName"
        }
      }
    },
    {
      "$facet": {
        "paginatedResults": [
          {
            "$addFields": {
              "item1": {
                "$toInt": "$costDetail.item.serviceAgent"
              }
            }
          },
          {
            "$project": {
              "vendr1": "$vendr1",
              "totalAmt": "$totalAmt",
              "item": "$item",
              "descforRef": "$descforRef",
              "itemCatg": "$itemCatg",
              "netValue": "$netValue",
              "currency": "$currency",
              "serviceAgent": "$serviceAgent",
              "vendr": "$organisationName"
            }
          },
          {
            "$skip": 1
          }
        ],
        "totalCount": [
          {
            "$count": "count"
          }
        ]
      }
    }
  ]
async function connectDB(){
const client= await MongoClient.connect('mongodb://127.0.0.1:27017/')
const db=client.db('Inbound')
const collection=db.collection('deliveryNotes')

if(!db){
    console.log('db not connected')
}
else{

    console.log('db connected')
    const result=await collection.aggregate(pipeline).toArray();
    const jsonResult=JSON.stringify(result)
    fs.writeFile(path.join(__dirname,'myFiles','query.json'),jsonResult,(err)=>{
        if(err) console.log(err)
        console.log('data updated') 
    
    })
    console.log(jsonResult)
}

}
connectDB()