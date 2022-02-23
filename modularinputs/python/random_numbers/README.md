splunk-sdk-python random_numbers example
========================================

This app provides an example of a modular input that generates a random number between the min and max values provided by the user during setup of the input.

### To run this example locally, follow the  below steps.

### Step 1

Execute the following command from the root of this repository.
```shell
SPLUNK_VERSION=latest docker compose up -d
```

### Step 2

Check the container health, run:
```shell
docker ps
```

### Step 3

Make sure STATUS is **healthy** for **splunk-app-examples** container.

Copy the `random_numbers` folder in `etc/apps/` inside the container.

Execute the following command from the root of this directory.
```shell
docker cp modularinputs/python/random_numbers splunk-app-examples:/opt/splunk/etc/apps/random_numbers
```

### Step 4

Install splunklib in `random_numbers/lib` folder.


```shell
docker exec -it -u root splunk-app-examples /bin/bash
```
```shell
pip install splunk-sdk -t ${SPLUNK_HOME}/etc/apps/random_numbers/lib
```
*If the last command fails, manually copy the `splunklib` in `/etc/apps/random_numbers/lib` directory inside container* 


### Step 5

Restart the container.

From UI:
```markdown
Settings > Server controls > Restart Splunk
```

From Terminal:
```shell
docker stop splunk-app-examples
```
```shell
docker start splunk-app-examples
```

### Step 6

Make sure the Splunk is in `healthy` state.

Log in into the Splunk UI, Go to ``Settings > DATA > Data inputs``

Search for `Random Numbers` (as per the `default/app.conf` file)

Click on the `+Add new` button in front of the `Random Numbers` which opens a configuration page for `Random Numbers` app.

`name`: Name of your choice to refer to this modularinput later. i.e. randomnumber

`Minimum`: Minimum random number to be produced by this input. i.e. Splunk

`Maximum`: Maximum random number to be produced by this input. i.e. splunk-sdk-python

Once the details are filled, click on `Next` and then click on `Start Searching`

## Awesome!

The setup is done. Try the following commands to see some results.

To get a random number for the `randomnumber` input that we configured above. Search 
```markdown
source="random_numbers://randomnumber"
```
    
To get random numbers for all the inputs in `random_numbers` app. Search
```markdown
source="random_numbers://*"
```

> NOTE: If no Random Numbers input appears then the script is likely not running properly, see https://docs.splunk.com/Documentation/SplunkCloud/latest/AdvancedDev/ModInputsDevTools for more details on debugging the modular input using the command line and relevant logs.

