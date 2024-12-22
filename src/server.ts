// import express, { Request, Response } from "express";
import { MikroORM } from '@mikro-orm/sqlite'; 
// import config from './mikro-orm.config.js';
// const app = express();
// const port = 3000;




const orm = await MikroORM.init();
console.log(orm.em); 
console.log(orm.schema);


await orm.close();



// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}`);
// });
