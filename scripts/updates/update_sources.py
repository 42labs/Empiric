import asyncio
import os

from empiric.core.client import EmpiricClient

publishers = ["EQUILIBRIUM"]
sources_to_add = [["DEFILLAMA", "KAIKO", "ASCENDEX"]]
NETWORK = "mainnet"


async def main():
    admin_private_key = int(os.environ.get(f"ADMIN_PRIVATE_KEY_{NETWORK.upper()}"), 0)
    admin_contract_address = (
        # 956631751072274915798544178446858402482160883188347933332347731459244945425
        1184650273608125575980484871523834017570590833292245732172420989117857221495
    )
    admin_client = EmpiricClient(
        network=NETWORK,
        account_private_key=admin_private_key,
        account_contract_address=admin_contract_address,
    )
    for publisher, sources in zip(publishers, sources_to_add):
        result = await admin_client.add_sources_for_publisher(publisher, sources)
        print(hex(result.hash))

        await result.wait_for_acceptance()


if __name__ == "__main__":
    asyncio.run(main())
