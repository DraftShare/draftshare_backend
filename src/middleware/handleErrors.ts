import express, { NextFunction, Request, Response } from "express";
// import { BaseError, ValidationError } from "../utils/errors.js";
import { GeneralError } from "../utils/errors.js";

export const handleErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: err.message,
  });


};

// // error handler middleware
// export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
//   if(err instanceof ValidationError) {
//       return res.status(err.status).json({
//           status: 'fail',
//           message: err.message,
//           data: err.errorData
//       })
//   } else if (err instanceof BaseError) {
//   if( err.isOperational) {
//       return res.status(err.status).json({
//           status: err.status < 500 && err.status >= 400 ? 'fail' :'error',
//           message: err.message
//       })
//       // 
//   } else {
//       // log the error
//       console.log(err)
//       // send generic error message
//       return res.status(err.status).json({
//           status: 'error',
//           message: 'Something went wrong'
//       })

//   }
//   }
// }