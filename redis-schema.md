# Redis Schema

The structure for storing user data is as follows, based on [this guide](https://redis.io/topics/twitter-clone):

```JAVASCRIPT
"DB": {
  "users": {
    "abcd1234": "1",
    "defg5678": "2",
    ...
  },
  "next_user_id": "51",
  "user:1": {
    discord_id: "abcd1234",
    updated_at: "1519211809934",
    nickname: "adam aardvark",
    initials: "AA",
    balance: "10000",
    joined_at: "1519211001056",
    last_seen_at: "1519211241511",
    last_seen_in: "channel a",
    steam_id: "my_steam_id",
    riot_id: "my_riot_id#me",
    genshin_impact_id: "123456789"
  },
  "user:2": {
    discord_id: "defg5678",
  ...
}
```
