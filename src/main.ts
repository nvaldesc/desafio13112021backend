import {app} from './app';
import * as http from 'http';
import { MongoHelper } from './mongoHelper';

const PORT = 8080;
const server = http.createServer(app);
server.listen(PORT);

server.on('listening',async() =>{
    console.info(`Listening on port ${PORT}`);
    try{

        //await MongoHelper.connect('mongodb+srv://chatapp:nestor@serverlessinstance0.legk1.mongodb.net/test');
        await MongoHelper.connect('mongodb://localhost:27017');
        console.info('Connected to Mongo');

    }catch(err){
        console.error(err);
    }

});