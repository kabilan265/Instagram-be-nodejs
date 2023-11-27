class ErrorHandler{
    constructor(msg,status){
      this.message = msg;
      this.code = status;
    }
}
module.exports = ErrorHandler;