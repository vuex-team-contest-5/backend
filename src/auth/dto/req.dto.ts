export interface ReqUserInterface {
  id: string;
  role: 'client' | 'admin';
}

// export {};
declare module 'express' {
  export interface Request {
    user: ReqUserInterface;
  }
}
