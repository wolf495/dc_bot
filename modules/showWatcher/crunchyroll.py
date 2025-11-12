import os,sys,subprocess,asyncio,crunpyroll,json # pyright: ignore[reportMissingImports]

file = open("../../secure_config/configCrunchyPass", "r")
crunchyEmail,crunchyPass = file.read().split(':')
client = crunpyroll.Client(email=crunchyEmail,password=crunchyPass,locale="en-US")
        

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
    queryTrackedShows = subprocess.run(['node', 'crunchyroll.js','check'], capture_output=True, text=True)
    #print(queryTrackedShows.stdout)
    trackedShows = json.loads(queryTrackedShows.stdout)
    #print(info['docs'])
    for trackedShow in trackedShows['docs']:
        print(trackedShow['series'])
        LastDubEp = await queryLastDubbedEp(trackedShow['series'])
        if LastDubEp.season_number != trackedShow['season'] or LastDubEp.episode_number != trackedShow['episode']:
            print('UPDATE DB: NEW DUB EP')
            command = ['node', 'crunchyroll_announce.js',
                    f'S{LastDubEp.season_number}E{LastDubEp.episode_number}:{LastDubEp.title}'
                    ,LastDubEp.season_title.split(' Season ')[0]
                    ,LastDubEp.images.thumbnail[0].url,
                    f'https://www.crunchyroll.com/watch/{LastDubEp.id}/{LastDubEp.slug}']
            subprocess.run(command, capture_output=True, text=True)
            #print(test)
            updateTrackedShow = trackedShow
            updateTrackedShow['series'] = LastDubEp.series_slug.replace("-"," ")
            updateTrackedShow['season'] = LastDubEp.season_number
            updateTrackedShow['episode'] = LastDubEp.episode_number
            updateTrackedShow['title'] = LastDubEp.title
            test = subprocess.run(['node', 'crunchyroll.js','update', json.dumps(updateTrackedShow)], capture_output=True, text=True)
            #print(test.stdout)
            #break 
        else:
            print('caught up')


async def addNewShow(newShow):
    alreadyTracked = False
    LastDubEp = await queryLastDubbedEp(newShow)
    #print (LastDubEp)
    if LastDubEp:
        queryTrackedShows = subprocess.run(['node', 'crunchyroll.js','check'], capture_output=True, text=True)
        trackedShows = json.loads(queryTrackedShows.stdout)
        for trackedShow in trackedShows['docs']:
            if LastDubEp.series_slug.replace("-"," ") == trackedShow['series'] or LastDubEp.season_title.split(' Season ')[0] == trackedShow['series']:
                alreadyTracked = True
                break
        #print(LastDubEp)
        
        #test = subprocess.run(['node', 'crunchyroll.js','add', json.dumps(newShow)], capture_output=True, text=True)
        #with open(f'{memory}\\{newShow}.txt', 'w') as file:
        #    file.write(f'S{LastDubEp.season_number}E{LastDubEp.episode_number}:{LastDubEp.title}')
        #pdbInsert({subsystem: 'bot' ,type: 'roleconfig',config: configuration})
        #print(newShow)
        if not alreadyTracked:
            newShow = {
                'subsystem':'anime',
                'series': LastDubEp.series_slug.replace("-"," "),
                'season': LastDubEp.season_number,
                'episode': LastDubEp.episode_number,
                'title': LastDubEp.title
            }
            #print(newShow)
            #print('CALL ADD js')
            test = subprocess.run(['node', 'crunchyroll.js','add', json.dumps(newShow)], capture_output=True, text=True)
        else:
            print("already tracked")
    else:
        return False
    return True

if len(sys.argv) > 0 and sys.argv[1].lower() == 'check':
    asyncio.run(checkForNewDubbed())
elif len(sys.argv) > 1 and sys.argv[1].lower() == 'add':
    asyncio.run(addNewShow(sys.argv[2]))
else:
    exit(1)
