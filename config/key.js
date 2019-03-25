// module.exports = {
//     MongoURI:"mongodb+srv://admin:admin@cluster0-ptakn.gcp.mongodb.net/test?retryWrites=true"
// }


dbPassword = 'mongodb+srv://admin:'+ encodeURIComponent('admin') + '@cluster0-ptakn.gcp.mongodb.net/test?retryWrites=true';

module.exports = {
    mongoURI: dbPassword
};
