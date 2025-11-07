from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..core.db.db import async_get_db
from ..schemas.credential_schema import (
    CredentialAllRead,
    CredentialCreate,
    CredentialPublicRead,
    CredentialRead,
    CredentialUpdate,
    PlatformCredentialCreate,
    PlatformCredentialUpdate,
)
from ..models.credential_model import Credential

router = APIRouter(prefix="/api/v1/credential", tags=["credentials"])


@router.post("/create")
async def add_credentials(
    credential: CredentialCreate, db: AsyncSession = Depends(async_get_db), request: Request = None
):
    try:
        new_cred = Credential(
            user_id=getattr(request.state, "user_id", credential.user_id),
            title=credential.title,
            platform=credential.platform,
            data=credential.data,
        )
        db.add(new_cred)
        await db.commit()
        await db.refresh(new_cred)

        return {
            "message": "Credentials added successfully",
            "data": {"credential_id": new_cred.id},
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/create-platform")
async def add_platform_credentials(
    credential: PlatformCredentialCreate, db: AsyncSession = Depends(async_get_db), request: Request = None
):
   
    try:

        data_dict = credential.fields
        
        new_cred = Credential(
            user_id=getattr(request.state, "user_id", None),
            title=credential.title,
            platform=credential.platform,
            data=data_dict,
        )
        db.add(new_cred)
        await db.commit()
        await db.refresh(new_cred)

        return {
            "message": "Credentials added successfully",
            "data": {
                "credential_id": new_cred.id,
                "title": new_cred.title,
                "platform": new_cred.platform,
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/update")
async def update_credential(
    credential: CredentialUpdate, db: AsyncSession = Depends(async_get_db), request: Request = None
):
    try:
        authed_user_id = getattr(request.state, "user_id", credential.user_id)
        result = await db.execute(
            select(Credential).where(
                (Credential.id == credential.id)
                & (Credential.user_id == authed_user_id)
            )
        )
        cred = result.scalar_one_or_none()

        if not cred:
            raise HTTPException(
                status_code=400, detail="Credential not found or does not exist"
            )

        if credential.data is not None:
            cred.data = credential.data
        if credential.title is not None:
            cred.title = credential.title
        if credential.platform is not None:
            cred.platform = credential.platform

        await db.commit()
        await db.refresh(cred)

        return {
            "message": "Credential updated successfully",
            "data": {"credential_id": cred.id},
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/update-platform")
async def update_platform_credential(
    credential: PlatformCredentialUpdate, db: AsyncSession = Depends(async_get_db), request: Request = None
):
   
    try:
        authed_user_id = getattr(request.state, "user_id", None)
        result = await db.execute(
            select(Credential).where(
                (Credential.id == credential.id)
                & (Credential.user_id == authed_user_id)
            )
        )
        cred = result.scalar_one_or_none()

        if not cred:
            raise HTTPException(
                status_code=400, detail="Credential not found or does not exist"
            )

        if credential.fields is not None:
            # Fields is already a dict from the schema
            cred.data = credential.fields
        if credential.title is not None:
            cred.title = credential.title

        await db.commit()
        await db.refresh(cred)

        return {
            "message": "Credential updated successfully",
            "data": {
                "credential_id": cred.id,
                "title": cred.title,
                "platform": cred.platform,
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/")
async def get_credential(
    credential_id: int = Query(...),
    user_id: int = Query(None),
    db: AsyncSession = Depends(async_get_db),
    request: Request = None,
):
   
    try:
        authed_user_id = getattr(request.state, "user_id", user_id)
        result = await db.execute(
            select(Credential).where(
                (Credential.id == credential_id) & (Credential.user_id == authed_user_id)
            )
        )
        cred = result.scalar_one_or_none()

        if not cred:
            raise HTTPException(
                status_code=400, detail="Credential not found or does not exist"
            )

        return {
            "message": "Credential fetched successfully",
            "data": {
                "id": cred.id,
                "title": cred.title,
                "platform": cred.platform,
                "user_id": cred.user_id,
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=List[CredentialRead])
async def get_all_credentials(
    user_id: int = Query(None), db: AsyncSession = Depends(async_get_db), request: Request = None
):
   
    try:
        authed_user_id = getattr(request.state, "user_id", user_id)
        results = await db.execute(
            select(Credential).where(Credential.user_id == authed_user_id)
        )
        credentials = results.scalars().all()

        return credentials

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error {str(e)}")
