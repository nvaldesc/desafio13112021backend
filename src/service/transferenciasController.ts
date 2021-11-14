import * as express from 'express';
import { Convert,Transferencia } from '../bean/transferencia';
import { MongoHelper } from '../mongoHelper';


const routesTransferencias = express.Router();
routesTransferencias.use(express.json());

const getCollection= (nameCollection:string)=>{
    return MongoHelper.client.db('bancoRipley').collection(nameCollection);
}



routesTransferencias.get('/:collection/historial',async (req:express.Request,resp:express.Response,next: express.NextFunction)=>{
    const collectionParam = req?.params?.collection;
    try {
        const collection = getCollection(collectionParam);
        const destinatarios = (await collection.find({}).toArray());
 
         resp.status(200).send(destinatarios);
     } catch (error) {
         resp.status(500).send(error.message);
     }

});
routesTransferencias.post('/:collection/saveTransferencia',async(req:express.Request,resp:express.Response,next: express.NextFunction)=>{

    const collectionParam = req?.params?.collection;
    try {
        //JSON.stringify(userData)
        Convert.toTransferencia(JSON.stringify(req.body));

        const collection = getCollection(collectionParam);
        const newTransferencia = req.body as Transferencia;
        
        const result = await collection.insertOne(newTransferencia);

        result
            ? resp.status(201).send({mensaje:`Transferencia realizada con exito, id ${result.insertedId}`})
            : resp.status(500).send("Error al transferir");
    } catch (error) {
        console.error(error);
        resp.status(400).send({error:error.message});
    }

});


export {routesTransferencias};