const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
//Đối với database dùng compass
const local = "mongodb://127.0.0.1:27017/MyDatabase"
//Đối với database dùng atlas(cloud)
const atlat = "mongodb+srv://trung:1234@atlascluster.ng51yx7.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster"
const connect = async () => {
    try {
        await mongoose.connect(local /*Truyền biến database muốn connect*/,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('connect success')
    } catch (error) {
        console.log(error)
        console.log('connect fail')
    }
}
module.exports = {connect}