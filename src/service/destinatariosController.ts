import * as express from 'express';
import { Convert, Destinatario } from '../bean/destinatario';
import { MongoHelper } from '../mongoHelper';


const routesDestinatarios = express.Router();
routesDestinatarios.use(express.json());

const getCollection= (nameCollection:string)=>{
    return MongoHelper.client.db('bancoRipley').collection(nameCollection);
}


routesDestinatarios.get('/:collection/getAll',async (req:express.Request,resp:express.Response,next: express.NextFunction)=>{
    const collectionParam = req?.params?.collection;
    try {
        const collection = getCollection(collectionParam);
        const destinatarios = (await collection.find({}).toArray());
 
         resp.status(200).send(destinatarios);
     } catch (error) {
         resp.status(500).send(error.message);
     }

});
routesDestinatarios.post('/:collection/saveDestinatario',async(req:express.Request,resp:express.Response,next: express.NextFunction)=>{

    const collectionParam = req?.params?.collection;
    try {
        //JSON.stringify(userData)
        Convert.toDestinatario(JSON.stringify(req.body));

        const collection = getCollection(collectionParam);
        const newDestinatario = req.body as Destinatario;
        
        const result = await collection.insertOne(newDestinatario);

        result
            ? resp.status(201).send({mensaje:`Nuevo destinatario creado con exito con el siguiente id ${result.insertedId}`})
            : resp.status(500).send("Error al crear nuevo destinatario");
    } catch (error) {
        console.error(error);
        resp.status(400).send({error:error.message});
    }

});


export {routesDestinatarios};