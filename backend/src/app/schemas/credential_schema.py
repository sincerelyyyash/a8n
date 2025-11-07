from typing import Annotated, Optional, Dict, Union

from pydantic import BaseModel, Field


class CredentialBase(BaseModel):
    title: Annotated[str, Field(min_length=2, max_length=20)]
    platform: Annotated[str, Field(min_length=2, max_length=20)]
    data: Annotated[Dict, Field(...)]


class CredentialPublicRead(CredentialBase):
    user_id: Annotated[int, Field(min_length=2, max_length=30)]
    id: Annotated[int, Field(min_length=2, max_length=30)]


class CredentialAllRead(CredentialBase):
    user_id: Annotated[int, Field(min_length=2, max_length=30)]


class CredentialRead(BaseModel):
    user_id: Annotated[int, Field(...)]
    id: Annotated[int, Field(...)]
    title: Annotated[str, Field(...)]
    platform: Annotated[str, Field(...)]


class CredentialUpdate(CredentialBase):
    id: Annotated[int, Field(...)]
    data: Annotated[Dict, Field(...)]


class CredentialCreate(CredentialBase):
    title: Annotated[str, Field(min_length=2, max_length=20)]
    platform: Annotated[str, Field(min_length=2, max_length=20)]
    data: Annotated[Dict, Field(...)]


class GmailCredentialFields(BaseModel):
    email: Annotated[str, Field(..., description="Gmail address")]
    app_password: Annotated[str, Field(..., description="Gmail app password")]


class LLMCredentialFields(BaseModel):
    api_key: Annotated[str, Field(..., description="LLM API key")]
    model: Annotated[Optional[str], Field(None, description="Model name (optional)")] = None


class TelegramCredentialFields(BaseModel):
    bot_token: Annotated[str, Field(..., description="Telegram bot token")]
    chat_id: Annotated[Optional[str], Field(None, description="Chat ID (optional)")] = None



class PlatformCredentialCreate(BaseModel):
    title: Annotated[str, Field(min_length=2, max_length=20)]
    platform: Annotated[str, Field(..., pattern="^(gmail|llm|telegram)$")]
    fields: Annotated[Dict, Field(..., description="Platform-specific credential fields as dict")]



class PlatformCredentialUpdate(BaseModel):
    id: Annotated[int, Field(...)]
    title: Annotated[Optional[str], Field(None, min_length=2, max_length=20)] = None
    fields: Annotated[Optional[Dict], Field(None, description="Platform-specific credential fields as dict")] = None


class CredentialsDelete(CredentialBase):
    pass
