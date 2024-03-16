const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const Users = new Scheme({
    username: {type: String, unique: true, maxLength: 255},
    password: {type: String, maxLength: 255},
    email: {type: String, unique: true},
    name: {type: String},
    avatar: {type: String},
    available: {type: Boolean, default: false},

}, {
    timestamps: true
})

module.exports = mongoose.model('user', Users)
/*
    mongoose.model('user', User)
    đặt tên collection, đặt ở dạng số ít 
    thư viện mongoose sẽ tự đọng tạo ra tên collection
    số nhiều (user => users)    
*/

/*
    Type: String, Boolean => kiểu dữ liệu
    unique: true => không đường trùng
    maxLength: 255 => tối đa ký tự được nhập
    default: false => giá trị mặt định là false
    timestamps => Tạo ra 2 trường createAt và updateAt
*/