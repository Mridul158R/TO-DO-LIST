const express = require("express");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")
const date = require(__dirname + "/date.js");


let workItem = [];
const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://mridul15:Tiwari15@cluster0.1niltum.mongodb.net/todolistDB")

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to todolist"
})
const item2 = new Item({
    name: "Hit + to add a new item"
})
const item3 = new Item({
    name: "Hit <-- to delete the the item"
})

const defaultItems = [item1,item2,item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/",function(req,res){
    
    Item.find({}, function(err, foundItems){
        if(foundItems.length == 0){
            Item.insertMany(defaultItems, function (err) {
                if(err){
                    console.log(err);
                }
                else{
                    console.log("added successfully");
                }
            });
            res.redirect("/");
        } 
        else{
            res.render('list', {listTitle: "Today", newListItem: foundItems});
        }
    });
    

})

app.get("/:customListName", function (req,res) {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save();
                res.redirect("/" + customListName);
            }
            else{
                res.render('list', {listTitle: foundList.name, newListItem: foundList.items});
            }
        }
    })
    
    

})

app.post("/",function(req,res){
    var itemName = req.body.newItem;
    const listName = req.body.list;
    const newItem = new Item({
        name: itemName
    })
    if(listName == "Today"){
    newItem.save();
    res.redirect("/");
    }
    else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/"+ listName);
        })
    }

    
    // if(req.body.List == "Work"){
    //     workItem.push(item);
    //     res.redirect("/work")
    // }
    // else{
    //     items.push(item);
    //     res.redirect("/")
    // }
    
    
})

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName == "Today"){
        Item.findByIdAndRemove(checkedItemId,function (err) {
            if(err){
                console.log(err);
            }
            else{
                console.log("successfully deleted");
                res.redirect("/")
            }
        })
    }
    else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err,foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        })
    }

    
})

app.get("/work",function(req,res){
    res.render('list',{listTitle: "Work list", newListItem: workItem});
})

app.get("/about",function(req,res){
    res.render("about");
})
let port = 8000;

app.listen(port,function(){
    console.log("server started");
})

