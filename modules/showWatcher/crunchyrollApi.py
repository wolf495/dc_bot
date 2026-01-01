import sys,asyncio,crunpyroll # pyright: ignore[reportMissingImports]

file = open("../../secure_config/configCrunchyPass", "r")
crunchyEmail,crunchyPass = file.read().split(':')
client = crunpyroll.Client(email=crunchyEmail,password=crunchyPass,locale="en-US")

async def queryLastDubbedEp(queryString):
    if not client.session.is_authorized:
        await client.start()
    query = await client.search(queryString)
    try:
        seasons = await client.get_seasons(query.items[0].id)
        episodes = await client.get_episodes(seasons.items[-1].id)
        LastDubEp = None
        for ep in episodes.items:
            if ep.is_dubbed:LastDubEp = ep
            else:break
        return LastDubEp
    except:
        return None
    

async def checkAnimeForNewEp(iAnime):
    LastDubEp = await queryLastDubbedEp(iAnime)
    print(LastDubEp)

#if len(sys.argv) > 0 and sys.argv[1].lower() == 'check':
asyncio.run(checkAnimeForNewEp(sys.argv[1]))
#    exit(0)
#else:
#    exit(1)
