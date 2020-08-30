### Deploy the code

```
npm install
```

```
sls deploy
```

### To connect to the endpoint

Get the endpoint (in the enpoints section) via

```
sls info
```

Use any websocket client in the frontend

#### Using this Lambda

You have to supply the values for the following parameters

- **invocation_threshold** - Number of times Lambda function is invoked in 1 minute, default is 30 times, if crossed activates the alarm
- **throttled_count** - No. of times Lambda function was throttled in 1 minute, default is 5 times, if crossed alarm goes off
- **Profile**
