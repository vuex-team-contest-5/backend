export interface ReqUserInterface {
  id: string;
  organization: { id: string; name: string };
}

// export {};
declare module 'express' {
  export interface Request {
    user: ReqUserInterface;
  }
}
