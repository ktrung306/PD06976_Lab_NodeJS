var express = require('express');
var router = express.Router();

//Thêm model
const Distributors = require('../models/distributors')
const Fruits =require('../models/fruits')
//Api thêm distributor
router.post('/add-distributor', async (req, res) =>{
    try {
        const data = req.body; // Lấy dữ liệu từ body
        const newDistributors = new Distributors({
            name: data.name
        }); //Tạo một đối tượng mới
        const result = await newDistributors.save(); //Thêm vào database
        if(result)
        {
            //Nếu thêm thành công result !null trả về dữ liệu
            res.json({
                "status" : 200,
                "messenger" : "Thêm thành công",
                "data" : result
            })
        }else
        {
            //Nếu thêm không thành công result null, thông báo không thành công 
            res.json({
                "status" : 400 ,
                "messenger" : "Lỗi, thêm không thành công",
                "data" : []
            })
        }
    } catch (error) {
        console.log(error);
    }
});

//Api thêm fruit
router.post('/add-fruit', async (req, res) => {
    try {
        const data = req.body; // Lấy dữ liệu từ body
        const newfruit = new Fruits({
            name: data.name,
            quantity : data.quantity,
            price : data.quantity,
            status : data.price,
            image : data.image,
            description : data.description,
            id_distributor : data.id_distributor
        }); // Tạo một đối tượng mới
        const result = await newfruit.save(); // Thêm vào database
        if(result)
        {//Nếu thêm thành công result !null trả về dữ liệu 
            res.json({
                "status" : 200,
                "messenger" : "Thêm thành công",
                "data" : result
            })  
        }else
        {
            //Nếu thêm không thành công result null, thông báo không thành công
            res.json({
                "status" : 400 ,
                "messenger" : "Lỗi, thêm không thành công",
                "data": []
            })
        }

    } catch (error) {
        console.log(error);
    }
});

//Lấy danh sách
router.get('/get-list-fruit', async (req, res) => {
    try {
        const data = await Fruits.find().populate('id_distributor');
        res.json({
            "status" : 200,
            "messenger" : "Danh sách fruit",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
});

//Lấy dữ liệu Fruits thông qua id
router.get('/get-fruit-by-id/:id', async (req, res) => {
    //:id param
    try {
        const {id} = req.params //Lấy dữ liệu thông qua: id trêm url gọi là param
        const data = await Fruits.findById(id).populate('id_distributor');
        res.json({
            "status" : 200,
            "messenger" : "Danh sách fruit",
            "data" : data
        })
    } catch (error) {
        console.log(error);    
    }
});

/*Lấy dữ liệu Fruits (danh sách trả về gồm: name, quantity, price, id_ditributor) nằm trong khoảng giá  
(query giá cao nhất, giá thấp nhất) */ 
router.get('/get-list-fruit-in-price', async(req, res) => {
    //:id param
    try {
        const {price_start, price_end} = req.query // Lấy dự liệu thông qua: id trên url gọi là param

        const query = {price: {$gte: price_start, $lte: price_end} }
        //$gte lớn hơn hoặc bằng, $ge lớn hơn
        //$lte nhỏ hơn hoặc bằng, $le nhỏ hơn
                                // truyền câu điều kiện, và chỉ lấy các trường mong muốn
        const data = await Fruits.find(query, 'name quantity price id_ditributor')
                                .populate('id_distributor')
                                .sort({quantity : -1}) //giảm dần = -1, tăng dần = 1
                                .skip(0) //bỏ qua số lượng row
                                .limit(2) //lấy 2 sản phẩm
        res.json({
            "status": 200,
            "messenger" : "Danh sách fruit",
            "data": data
        })
    } catch (error) {
        console.log(error);  
    }
});

//Lấy dữ liệu Fruits cái bắt đầu tên là A hoặc X 
router.get('/get-list-fruit-have-name-a-or-x', async (req, res) => {
    //:id param
    try {
        const query = {$or: [
            {name: {$regex: 'T'}},
            {name: {$regex: 'X'}},
        ]}
        //Truyền câu điều kiện, và chỉ lấy các trường mong muốn
        const data = await Fruits.find(query, 'name quantity price id_ditributor')
                                .populate('id_distributor')
        res.json({
            "status" : 200,
            "messenger" : "Danh sách fruit",
            "data" : data
        })
    } catch (error) {
        console.log(error);
    }
});

//CẬP NHẬT FRUITS BẰNG ID (PUT)
router.put('/update-fruit-by-id/:id', async (req, res) => {
    try {
        const {id} = req.params
        const data = req.body; //Lấy dữ liệu từ body
        const updatefruit = await Fruits.findById(id)
        let result = null;
        if(updatefruit)
        {
            updatefruit.name = data.name ?? updatefruit.name;
            updatefruit.quantity = data.quantity ?? updatefruit.quantity,
            updatefruit.price = data.price ?? updatefruit.price,
            updatefruit.status = data.status ?? updatefruit.status,
            updatefruit.image = data.image ?? updatefruit.image,
            updatefruit.description = data.description ?? updatefruit.description,
            updatefruit.id_distributor = data.id_distributor ?? updatefruit.id_distributor,
            result = await updatefruit.save();
        }
        //Tạo một đối tượng mới
        //Thêm vào database
        if(result)
        {
            //Nếu thêm thành công result !null trả về dữ liệu
            res.json({
                "status" : 200,
                "messenger" : "Cập nhật thành công",
                "data" : result
            })
        }else
        {
            //Nếu thêm không thành công result null, thông báo không thành công
            res.json({
                "status" : 400,
                "messenger" : "Lỗi, Cập nhật không thành công",
                "data" : []
            })
        }

    } catch (error) {
        console.log(error);
    }
});
module.exports = router;