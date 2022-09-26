const {establishDatabaseConnection} = require("./db/index");
const verifyJumpAuthHeader = require("./src/middlewares/jump-auth-middleware");
const {cacheManager} = require("./src/usecases/cache/cache-manager");


const startServer = () => {
    const PORT = process.env.APP_PORT || 3000;
    const http = require("http");
    const express = require("express");
    const app = express();

    app.use(verifyJumpAuthHeader(), async (req, res) => {
        const {value} = await cacheManager(req.headers['jump-auth-token'])
        return res.status(200).json({
            data: value
        });
    })


    http.createServer(app).listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
};


return establishDatabaseConnection()
    .then(() => {
        return startServer();
    }).catch((error) => {
        console.log("Couldn't start the application because of error ", error);
        process.exit(-1);
    });
