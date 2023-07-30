import asyncio
import json
import os

import boto3
from empiric.core.logger import get_stream_logger
from empiric.core.utils import currency_pair_to_pair_id
from empiric.publisher.assets import get_asset_spec_for_pair_id_by_type
from empiric.publisher.client import EmpiricPublisherClient

logger = get_stream_logger()

SECRET_NAME = os.environ["SECRET_NAME"]
NETWORK = os.environ["NETWORK"]
ASSETS = os.environ["ASSETS"]
ASSET_TYPE = os.environ.get("ASSET_TYPE", "SPOT")


def handler(event, context):
    assets = [get_asset_spec_for_pair_id_by_type(asset, ASSET_TYPE) for asset in ASSETS.split(",")]
    invocation = asyncio.run(_handler(assets))
    return {
        "result": invocation,
    }


def _get_pvt_key():
    region_name = "eu-west-3"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)
    get_secret_value_response = client.get_secret_value(SecretId=SECRET_NAME)
    return int(
        json.loads(get_secret_value_response["SecretString"])["PUBLISHER_PRIVATE_KEY"]
    )


async def _handler(assets):
    private_key = _get_pvt_key()
    # private_key = int(os.environ["PRIVATE_KEY"])

    account_address = int(os.environ.get("ACCOUNT_ADDRESS"))
    pairs = [
        currency_pair_to_pair_id(*p["pair"]) for p in assets if p["type"] == ASSET_TYPE
    ]

    publisher_client = EmpiricPublisherClient(
        account_private_key=private_key,
        account_contract_address=account_address,
        network=NETWORK,
    )
    invocation = await publisher_client.set_checkpoints(pairs, pagination=40)
    print(f"Set checkpoints for pairs {pairs} at tx hash : {hex(invocation.hash)}")
    # await invocation.wait_for_acceptance(wait_for_accept=True)

    return invocation.hash


if __name__ == "__main__":
    handler(None, None)
