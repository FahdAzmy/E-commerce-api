// @desc this class is responsible about operation errors(erroe i can pridect)
class apiError extends Error{
    constructor(massage,statusCode){
        super(massage)
        this.statusCode=statusCode
        this.status=`${statusCode}`.startsWith(4) ? `fail`:`error`
        this.isOperational=true
    }
}
module.exports=apiError