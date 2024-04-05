var express = require('express');
var router = express.Router();

//Thêm model
const Distributors = require('../models/distributors')
const Fruits =require('../models/fruits');
const Upload = require('../config/common/upload');
const Users = require('../models/users');
const Transporter = require('../config/common/mail');
// Lab 3_3.Api thêm distributor
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

//Lab 3_3.Api thêm fruit
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

//Lab3_4.Lấy danh sách
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

//Lab3_4.Lấy dữ liệu Fruits thông qua id
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

/*Lab3_4.Lấy dữ liệu Fruits (danh sách trả về gồm: name, quantity, price, id_ditributor) nằm trong khoảng giá  
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

//Lab3_4.Lấy dữ liệu Fruits cái bắt đầu tên là A hoặc X 
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

//Lab3_5.CẬP NHẬT FRUITS BẰNG ID (PUT)
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

//Lab4_1.delete fruit
router.delete('/destroy-fruit-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params
        const result = await Fruits.findByIdAndDelete(id);
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Xóa thành công",
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi! xóa không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
});

//Lab4_2.upload image
router.post('/add-fruit-with-file-image', Upload.array('image', 5), async (req, res) => {
    //Upload.array('image',5) => up nhiều file tối đa là 5
    //upload.single('image') => up load 1 file
    try {
        const data = req.body; // Lấy dữ liệu từ body
        const { files } = req //files nếu upload nhiều, file nếu upload 1 file
        const urlsImage =
            files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`)
        //url hình ảnh sẽ được lưu dưới dạng: http://localhost:3000/upload/filename
        const newfruit = new Fruits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: urlsImage, /* Thêm url hình */
            description: data.description,
            id_distributor: data.id_distributor
        }); //Tạo một đối tượng mới
        const result = await newfruit.save(); //Thêm vào database
        if (result) {// Nếu thêm thành công result !null trả về dữ liệu
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {// Nếu thêm không thành công result null, thông báo không thành công
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
});

//Lab4_3.register-send-email
router.post('/register-send-email', Upload.single('avatar'), async (req, res) => {
    try {
        const data = req.body;
        const { file } = req
        const newUser = Users({
            username: data.username,
            password: data.password,
            email: data.email,
            name: data.name,
            avatar: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
            //url avatar http://localhost:3000/uploads/filename
        })
        const result = await newUser.save()
        if (result) { //Gửi mail
            const mailOptions = {
                from: "khactrungcc18@gmail.com", //email gửi đi
                to: result.email, // email nhận
                subject: "Đăng ký thành công", //subject
                text: "Cảm ơn bạn đã đăng ký", // nội dung mail
            };
            // Nếu thêm thành công result !null trả về dữ liệu
            await Transporter.sendMail(mailOptions); // gửi mail
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {// Nếu thêm không thành công result null, thông báo không thành công
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
});

//Lab4_4.Đăng nhập
const JWT = require('jsonwebtoken');
const SECRETKEY = "FPTPOLYTECHNIC"
router.post('/login',async (req,res)=>{
    try {
        const {username,password} = req.body;
        const user = await Users.findOne({username,password})
        if(user)
        {   
            //Token người dùng sẽ sử dụng gửi lên trên header mỗi lần muốn gọi api
            const token = JWT.sign({id: user._id},SECRETKEY,{expiresIn: '1h'});
            //Khi token hết hạn, người dùng sẽ call 1 api khác để lấy token mới
            //Lúc này người dùng sẽ truyền refreshToken lên để nhận về 1 cặp token,refreshToken mới
            //Nếu cả 2 token đều hết hạn người dùng sẽ phải thoát app và đăng nhập lại
            const refreshToken = JWT.sign({id: user._id},SECRETKEY,{expiresIn: '1d'})
            //expiresIn thời gian token
            res.json({
                "status" : 200,
                "messenger" : "Đăng nhâp thành công",
                "data" : user,
                "token" : token,
                "refreshToken" : refreshToken
            })
        }else
        {
            // Nếu thêm không thành công result null, thông báo không thành công
            res.json({
                "status" : 400 ,
                "messenger" : "Lỗi, đăng nhập không thành công",
                "data" : []
            })
        }
    } catch (error) {
        console.log(error);
    }
});

//Lab4_4.get-list-fruit
router.get('/get-list-fruit', async(req,res,next) => {
    const authHeader = req.headers['authorization']
    //Authorization thêm từ khoá 'Bearer token'
    //Nên sẽ xử lý cắt chuỗi
    const token = authHeader && authHeader.split(' ')[1]
    //Nếu không có token sẽ trả về 401
    if(token == null) return res.sendStatus(401)
    let payload;
    JWT.verify(token, SECRETKEY, (err,_payload) => {
        //Kiểm tra token, nếu token ko đúng, hoặc hết hạn
        if(err instanceof JMT.TokenExpiredErroi) return res.sendStatus(401)
        if(err) return res.sendStatus(403)
        //Nếu đúng sẽ log ra dữ liệu
        payload = _payload;
    })
    console.log(payload);
    try {
        const data = await Fruits.find().populate('id_distributor');
        res.json({
            "status": 200,
            "messenger" : "Danh sách fruit",
            "data" : data
        })
    } catch (error) {
        console.log(error);
    }
});

//Lab5_1.Viết API 
router.get('/get-list-distributor', async(req,res) => {
    try {
        //Lấy danh sách theo thứ tự distributor mới nhất 
        const data = await Distributors.find().sort({createdAt: -1});
        if(data)
        {
            //Trả về danh sách
            res.json({
                "status": 200,
                "messenger": "Thành công",
                "data": data
            })
        }else
        {
            //Nếu thêm không thành công result null, thông báo không thành công
            res.json({
                "status" : 400,
                "messenger": "Lỗi, không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
});
///
router.get('/search-distributor', async(req, res) => {
    try {
        const key = req.query.key; //Nhận từ query
        //Lấy danh sách theo thứ tự distributors mới nhất
        const data = await Distributors.find({name: {"$regex": key, "$options": "i"}})
                                        .sort({createdAt: -1});
        if(data)
        {
            //Trả về danh sách
            res.json({
                "status": 200,
                "messenger" : "Thành công",
                "data": data
            })
        }else 
        {
            //Nếu thêm không thành công result null, thông báo không thành công
            res.json({
                "status": 400,
                "messenger": "Lỗi, thành công",
                "data": []
            })
        } 
    } catch (error) {
        console.log(error);
    }
});
///
router.delete('/delete-distributor-by-id/:id', async(req, res) =>{
    try {
        const {id} = req.params
        const result = await Distributors.findByIdAndDelete(id);
        if(result)
        {
            //Nếu xoá thành công sẽ trả về thông item đã xoá
            res.json({
                "status" : 200,
                "messenger" : "Xoá thành công",
                "data" : result 
            })
        }else
        {
            res.json({
                "status": 400,
                "messenger": "Lỗi, Xoá không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
});
///
router.put('/update-distributor-by-id/:id', async(req, res) =>{
    try {
        const {id} = req.params
        const data = req.body;
        const result = await Distributors.findByIdAndUpdate(id,{name : data.name})
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
                "data" : null
            })
        }
    } catch (error) {
        console.log(error);
    }
});

///Lab 6
router.post('/add-fruit-with-file-image', Upload.array('image', 5), async(req, res) => {
    //Upload.array('image', 5) => up nhiều file tối đa là 5
    //Upload.single('image') => up load 1 file
    try {
        const data = req.body //Lấy dữ liệu từ body
        const {files} = req //Lấy files nếu upload nhiều, file nếu 1
        const urlsImage = files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`)
        const newfruit = new Fruits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: urlsImage, /*Thêm cả url hình */
            description: data.description,
            id_distributor: data.id_distributor
        }); //Tạo một đối tượng mới 
        const result = (await newfruit.save()).populate("id_distributor"); // Thêm vào database
        if(result)
        {
            //Nếu thêm thành công result !null trả về dữ liệu 
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        }else
        {
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
});

//lab 7
//load more
router.get('/get-page-fruit', async (req, res) => {
    //Auten
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401)
    let payload;
    JWT.verify(token, SECRETKEY, (err, _payLoad) => {
        if (err instanceof JWT.TokenExpiredError) return res.sendStatus(401)
        if (err) return res.sendStatus(403)
        payload = _payLoad
    })
    let perPage = 6;
    let page = req.query.page || 1;
    let skip = (perPage * page) - perPage;
    let count = await Fruits.find().count();
    const name = { "$regex": req.query.name ?? "", "$options": "i" }

    const price = { $gte: req.query.price ?? 0 }
    console.log(222, typeof (req.query.sort));

    const sort = { price: Number(req.query.sort) ?? 1 }
    try {
        console.log(1111111, name + "price" + req.query.sort);
        const data = await Fruits.find({ name: name, price: price })
            .populate('id_distributor')
            .sort(sort)
            .skip(skip)
            .limit(perPage)
        res.json({
            "status": 200,
            "messenger": "Danh sách fruit",
            "data": {
                "data": data,
                "currentPage": Number(page),
                "totalPage": Math.ceil(count / perPage)
            }
        }
        )

    } catch (err) {
        console.log(err);

    }
})
module.exports = router;