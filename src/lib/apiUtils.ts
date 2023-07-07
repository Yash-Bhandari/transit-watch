import { NextApiRequest, NextApiResponse } from "next";

export class APIException extends Error {
  public code: string;
  public clientVisible: boolean;
  /**
   * Custom error class for API exceptions
   * @param message Ful description of the error
   * @param code short code for the error for ease of handling/searching
   * @param clientVisible Should the error message be visible to the client in prod
   */
  constructor(message: string, code: string, clientVisible = true) {
    super(message);
    this.code = code;
    this.clientVisible = clientVisible;
  }
}

export const inProd = process.env.NODE_ENV === "production";
/**
 * Wraps an API handler, adding automatic error handling.
 */
export const withErrorHandling =
  (handler: (req: NextApiRequest, res: NextApiResponse) => void) =>
  (req: NextApiRequest, res: NextApiResponse) => {
    try {
      handler(req, res);
    } catch (e) {
      if (e instanceof APIException && e.clientVisible) {
        return res.status(400).json({ code: e.code, message: e.message });
      }
      if (e instanceof SyntaxError)
        return res
          .status(400)
          .json({ code: "invalid_json", message: e.message });
      // only show unhandled error messages in development
      return res
        .status(500)
        .json({ code: "internal_error", message: inProd ? "" : e.message });
    }
  };
