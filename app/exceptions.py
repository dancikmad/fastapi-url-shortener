from fastapi import HTTPException, status, Request


class UrlException(HTTPException):
    status_code = 500
    detail = ""

    def __init__(self):
        super().__init__(status_code=self.status_code, detail=self.detail)


class BadRequestException(UrlException):
    status_code = status.HTTP_400_BAD_REQUEST
    detail = "Your provided URL is not valid"


class NotFoundException(HTTPException):
    def __init__(self, request: Request):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"URL '{request.url}' doesn't exist",
        )
