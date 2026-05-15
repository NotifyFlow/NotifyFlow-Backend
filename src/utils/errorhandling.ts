
export class NotRetyableError extends Error{
    constructor(message:string)
    {
        super(message);
        this.name = "NonRetyableError";
    }
}