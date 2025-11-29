// This is a type declaration file for the API

declare namespace Express {
  interface Request {
    userId?: string;
  } // Request doesn't have any Interface related to userId, we are overriding using the declaration file
}
