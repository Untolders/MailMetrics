class ExpressError extends Error{

    constructor(statusCode,message,stack){
        super();
        this.statusCode=statusCode;
        this.message=message;
        this.stack=stack;
        
    }
}

module.exports=ExpressError;