const { notFoundError, generalError } = require("./errors");

describe("Given a notFoundError middleware function", () => {
  describe("When it receives a response", () => {
    test("Then it should call response status and json methods", () => {
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      notFoundError(null, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalled();
    });
  });
});

describe("Given a generalError middleware function", () => {
  describe("When it receives an error and a response", () => {
    test("Then it should call response status and json methods", () => {
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      const error = {
        code: 403,
        message: "Forbidden",
      };
      const expectedError = { error: true, message: error.message };

      generalError(error, null, res);

      expect(res.status).toHaveBeenCalledWith(error.code);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a response", () => {
    test("Then it should call response status and json methods with errorcode 500 and errorMessage 'Internal server error'", () => {
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      const passedError = {
        code: 403,
        message: "Forbidden",
      };
      const expectedCode = passedError.code;
      const expectedError = { error: true, message: passedError.message };
      generalError(passedError, null, res);

      expect(res.status).toHaveBeenCalledWith(expectedCode);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});
