module.exports = {
    name:"test",
      events:{
        
        "file.saved"(payload){
            console.log("events", payload);
        }
    }
}