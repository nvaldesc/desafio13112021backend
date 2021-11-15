import * as express from 'express';
import * as cors from 'cors';
import { routesDestinatarios } from './service/destinatariosController';
import { routesTransferencias } from './service/transferenciasController';

const app = express();
app.use(cors());
app.use(routesDestinatarios);
app.use(routesTransferencias);


export {app};