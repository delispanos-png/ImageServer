"""
Health Check Module for CloudOn Platform
Provides comprehensive health checks for all system components
"""

from datetime import datetime, timezone
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status
from pymongo.database import Database
import httpx


router = APIRouter(prefix="/health", tags=["health"])


async def check_mongodb(db: Database) -> Dict[str, Any]:
    """Check MongoDB connection and status"""
    try:
        # Ping MongoDB
        await db.command("ping")

        # Get server status
        server_status = await db.command("serverStatus")

        return {
            "status": "healthy",
            "version": server_status.get("version", "unknown"),
            "uptime_seconds": server_status.get("uptime", 0),
            "connections": server_status.get("connections", {}).get("current", 0),
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }


async def check_xml_service(xml_service_url: str = "http://xml_generator:80") -> Dict[str, Any]:
    """Check XML Generator service health"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{xml_service_url}/health")
            if response.status_code == 200:
                return {
                    "status": "healthy",
                    "response_time_ms": response.elapsed.total_seconds() * 1000
                }
            else:
                return {
                    "status": "degraded",
                    "status_code": response.status_code
                }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }


@router.get("", response_model=Dict[str, Any])
async def health_check() -> Dict[str, Any]:
    """
    Basic health check endpoint
    Returns 200 if service is running
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "CloudOn Content Sync Platform API",
        "version": "2.0.0"
    }


@router.get("/ready", response_model=Dict[str, Any])
async def readiness_check() -> Dict[str, Any]:
    """
    Readiness check - indicates if service is ready to accept traffic
    Checks critical dependencies
    """
    from main import app

    checks = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "ready",
        "checks": {}
    }

    # Check MongoDB
    try:
        db = app.state.cms_db
        mongo_health = await check_mongodb(db)
        checks["checks"]["mongodb"] = mongo_health

        if mongo_health["status"] != "healthy":
            checks["service"] = "not_ready"
    except Exception as e:
        checks["checks"]["mongodb"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        checks["service"] = "not_ready"

    # Check XML Service
    try:
        xml_health = await check_xml_service()
        checks["checks"]["xml_generator"] = xml_health

        # XML service being down is not critical for readiness
        # but we log it
    except Exception as e:
        checks["checks"]["xml_generator"] = {
            "status": "unknown",
            "error": str(e)
        }

    if checks["service"] != "ready":
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=checks
        )

    return checks


@router.get("/live", response_model=Dict[str, Any])
async def liveness_check() -> Dict[str, Any]:
    """
    Liveness check - indicates if service is alive
    Simple check that doesn't depend on external services
    """
    return {
        "status": "alive",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


def create_health_router() -> APIRouter:
    """Factory function to create health router"""
    return router
