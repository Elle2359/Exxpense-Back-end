const getExpense=(req)=>{
    return req.user.getExpenses();

}

module.exports={
    getExpense
}  