import asyncio
import sys

sys.path.append("..")

from monitors.balance.app import _handler  # noqa: E402


def handler(event, context):
    asyncio.run(_handler())
    return {"success": True}
