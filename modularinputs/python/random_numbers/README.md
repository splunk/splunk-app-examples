splunk-sdk-python random_numbers example
========================================

This app provides an example of a modular input that generates a random number between the min and max values provided by the user during setup of the input.

### To run this example locally, follow the  below steps.

### Step 1
Execute the following command from the root of this repository.
```shell
make up
```

### Step 2
Make sure the Splunk is in `healthy` state., run:
```shell
docker ps
```

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

