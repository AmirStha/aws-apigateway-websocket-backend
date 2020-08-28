### To connect to the endpoint

Get the enpoint (in the enpoints section) via

```
sls info
```

Use any websocket client in the frontend

#### Using this Lambda

<!-- This Lambda function integrates with [**resource-monitoring-lambda**](https://gitlab.com/bottle-tech/bottle-library/resource-monitoring-lambda) to monitor **Invocations** and **Throttles** -->

You have to supply the values for the following parameters

- **invocation_threshold** - Number of times Lambda function is invoked in 1 minute, default is 30 times, if crossed activates the alarm
- **throttled_count** - No. of times Lambda function was throttled in 1 minute, default is 5 times, if crossed alarm goes off
- **Profile**

To make it your own sls setup:

sls install --url https://github.com/AmirStha/lambda-starter-custom --name <yout_lambda_projectname>

To deploy this Lambda function use the following behaviour :

```
sls deploy --invocation_threshold 30 --profile learn --throttled_count 5
```

<!-- In **Alarm Actions** there is a SNS topic **SNSTopicMonitorBottleLambda** which was imported from the Stack made for creating [**resource-monitoring-lambda**](https://gitlab.com/bottle-tech/bottle-library/resource-monitoring-lambda).
To view the name of the SNS topic for the import, view the exports section in the Cloudformation created by [**resource-monitoring-lambda**](https://gitlab.com/bottle-tech/bottle-library/resource-monitoring-lambda) -->
