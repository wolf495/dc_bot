import os,sys,subprocess,asyncio,crunpyroll


memory = "C:\\_DEV\\dc_bot\\python\\memory\\crunchyroll"

client = crunpyroll.Client(
    email="MortyNewman94@hotmail.com",
    password="nncBWpIy5",
    locale="en-US"
)
        

async def queryLastDubbedEp(queryString):
    if not client.session.is_authorized:
        await client.start()
    query = await client.search(queryString)
    series_id = query.items[0].id
    seasons = await client.get_seasons(series_id)
    latestSeason = seasons.items[-1].id
    episodes = await client.get_episodes(latestSeason)
    LastDubEp = None
    for ep in episodes.items:
        if ep.is_dubbed:LastDubEp = ep
        else:break
    return LastDubEp

async def checkForNewDubbed():
    trackedShows = os.listdir(memory)
    for show in trackedShows:
        queryStr = os.path.splitext(show)[0]
        LastDubEp = await queryLastDubbedEp(queryStr)
        CurLastDubbedStr = f'S{LastDubEp.season_number}E{LastDubEp.episode_number}:{LastDubEp.title}'
        MemLastDubbedStr = None
        with open(f'{memory}\\{show}', 'r') as file:
            MemLastDubbedStr = file.read()

        if CurLastDubbedStr != MemLastDubbedStr:
            command = ['node', '..\\crunchyroll_announce.js',
                    CurLastDubbedStr,LastDubEp.season_title.split(' Season ')[0],
                    LastDubEp.images.thumbnail[0].url,
                    f'https://www.crunchyroll.com/watch/{LastDubEp.id}/{LastDubEp.slug}']
            result = subprocess.run(command, capture_output=True, text=True)
            with open(f'{memory}\\{show}', 'w') as file:
                file.write(CurLastDubbedStr)

async def addNewShow(newShow):
    LastDubEp = await queryLastDubbedEp(newShow)
    if LastDubEp:
        with open(f'{memory}\\{newShow}.txt', 'w') as file:
            file.write(f'S{LastDubEp.season_number}E{LastDubEp.episode_number}:{LastDubEp.title}')
    else:
        return False
    return True

if len(sys.argv) > 0 and sys.argv[1].lower() == 'check':
    asyncio.run(checkForNewDubbed())
elif len(sys.argv) > 1 and sys.argv[1].lower() == 'add':
    asyncio.run(addNewShow(sys.argv[2]))
else:
    exit(1)
