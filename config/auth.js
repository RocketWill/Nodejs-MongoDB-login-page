module.exports = {
    ensureAuthenticated: function(req, res, next){
        if (req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', "請先登錄才能查看此頁");
        res.redirect('/users/login');
    }
}