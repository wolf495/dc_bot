import crunpyroll
import asyncio

client = crunpyroll.Client(
    email="MortyNewman94@hotmail.com",
    password="nncBWpIy5",
    locale="en-US"
)
async def main():
    # Start client and login
    await client.start()
    # Search for Attack on Titan
    query = await client.search("My Dress Up Darling")
    series_id = query.items[0].id
    print("===SERIESID=====")
    print(series_id)
    # Retrieve all seasons of the series
    seasons = await client.get_seasons(series_id)
    print("===SEASONSID=====")
    print(seasons)
    episodes = await client.get_episodes("GY19CPG00")
    #print(type(episodes))
    #xx = episodes.items[0]
    #print(xx)
    #[a for a in dir(episodes) if not a.startswith('__') and not callable(getattr(episodes, a))]
    print(episodes.items[0])
    for ep in episodes.items:
        strOut = f'S{ep.season_number}E{ep.episode_number}:{ep.title} '
        if ep.is_dubbed:
            strOut+=f'[Dubbed]'
        print(strOut)
    print("===EPS=====")
    #print(episodes)


asyncio.run(main())