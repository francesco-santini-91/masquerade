var mongoose = require('mongoose');
 
function DBConnection(uri) {
    var result = mongoose.connect(uri, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
                })
                .catch(err => { //if there are any errors...
                    console.error('Errore durante la connessione al Database:', err.stack);
                    return err;
                })
                .then(() => {
                    console.log("Connesso al Database.");
                });
    return result;
    }
     
module.exports = DBConnection;