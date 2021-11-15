import * as express from 'express';
import { Destinatario } from '../bean/destinatario';
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
        const sort = { '_id': -1 };
        const destinatarios = (await collection.find().toArray());
         resp.status(200).send(destinatarios.reverse());
     } catch (error) {
         resp.status(500).send(error.message);
     }

});
routesTransferencias.post('/:collection/saveTransferencia',async(req:express.Request,resp:express.Response,next: express.NextFunction)=>{

    const collectionParam = req?.params?.collection;
    try {
        

        Convert.toTransferencia(JSON.stringify(req.body));

        const collection = getCollection(collectionParam);
        const newTransferencia = req.body as Transferencia;
        
        const result = await collection.insertOne(newTransferencia);

        result
            ? resp.status(201).send({mensaje:`Transferencia realizada con exito, id ${result.insertedId}`})
            : resp.status(500).send("Error al transferir");

            if(result){
            enviarEmail(newTransferencia.nombre,newTransferencia.rut,newTransferencia.tipoCuenta.name,newTransferencia.numCuenta,newTransferencia.bancoDestino.name,
                newTransferencia.correo,newTransferencia.monto);
            }
    } catch (error) {
        console.error(error);
        resp.status(400).send({error:error.message});
    }

});

function enviarEmail(destinatario,rut,tCuenta,nCuenta,banco,email,monto) {
 //Requerimos el paquete
 var nodemailer = require('nodemailer');

 //Creamos el objeto de transporte
 var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: 'example.desafio.r@gmail.com',
     pass: 'nestor123456789'
   }
 });
 
 var mensaje = `Estimado ${destinatario},
 Le informamos que nuestro cliente acaba de efectuar una Transferencia en forma exitosa con el siguiente detalle:\n

 Destino\n
 Nombre Destinatario: ${destinatario}
 Rut: ${rut}
 Tipo de Cuenta: ${tCuenta}
 Nº de cuenta: ${nCuenta}
 Banco: ${banco}
 Email: ${email}
 
 Monto: $${monto}`;
 
 var mailOptions = {
   from: 'example.desafio.r@gmail.com',
   to: email,
   subject: 'Transferencia a Terceros',
   text: mensaje
 };
 
 transporter.sendMail(mailOptions, function(error, info){
   if (error) {
     console.log(error);
   } else {
     console.log('Email enviado: ' + info.response);
   }
 });
}

export {routesTransferencias};


