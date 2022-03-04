splunk-sdk-python searchcommands_app example
=============================================

This app provides several examples of custom search commands that illustrate each of the base command types:

| Command       | Type       | Description                                                                                           |
|:--------------|:-----------|:------------------------------------------------------------------------------------------------------|
| countmatches  | Streaming  | Counts the number of non-overlapping matches to a regular expression in a set of fields.              |
| generatetext  | Generating | Generates a specified number of events containing a specified text string.                            |
| simulate      | Generating | Generates a sequence of events drawn from a csv file using repeated random sampling with replacement. |
| generatehello | Generating | Generates a specified number of events containing the text string 'hello'.                            |
| sum           | Reporting  | Adds all of the numbers in a set of fields.                                                           |
| filter        | Eventing   | Filters records from the events stream based on user-specified criteria.                              |

The app is tested on Splunk 8. Here is its manifest:

```
├── bin
│   ├── countmatches.py .......... CountMatchesCommand implementation
│   ├── generatetext.py .......... GenerateTextCommand implementation
│   ├── simulate.py .............. SimulateCommand implementation
│   └── sum.py ................... SumCommand implementation
├── lib
|   └── splunklib ................ splunklib module
├── default
│   ├── data
│   │   └── ui
│   │       └── nav
│   │           └── default.xml ..
│   ├── app.conf ................. Used by Splunk to maintain app state [1]
│   ├── commands.conf ............ Search command configuration [2]
│   ├── logging.conf ............. Python logging[3] configuration in ConfigParser[4] format
│   └── searchbnf.conf ........... Search assistant configuration [5]
└── metadata
    └── default.meta ............. Permits the search assistant to use searchbnf.conf[6]
```
**References**  
[1] [app.conf](https://docs.splunk.com/Documentation/Splunk/latest/Admin/Appconf app.conf)  
[2] [commands.conf](https://docs.splunk.com/Documentation/Splunk/latest/Admin/Commandsconf)  
[3] [Python Logging HOWTO](https://docs.python.org/2/howto/logging.html)  
[4] [ConfigParser—Configuration file parser](https://docs.python.org/2/library/configparser.html)
[5] [searchbnf.conf](https://docs.splunk.com/Documentation/Splunk/latest/admin/Searchbnfconf)
[6] [Set permissions in the file system](https://docs.splunk.com/Documentation/Splunk/latest/AdvancedDev/SetPermissions#Set_permissions_in_the_filesystem)

## Installation

+ Bring up Dockerized Splunk with the app installed from the root of this repository via:

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

Copy the content of `searchcommands_app/package/` folder in `/etc/apps/searchcommands_app/` inside the container.

Execute the following command from the root of this directory.
```shell
docker cp python/customsearchcommands_app/package/ splunk-app-examples:opt/splunk/etc/apps/customsearchcommands_app/
```

### Step 4
Install splunklib in `searchcommands_app/lib` folder. 
```shell
docker exec -it -u root splunk-app-examples /bin/bash
```
```shell
pip install splunk-sdk -t ${SPLUNK_HOME}/etc/apps/customsearchcommands_app/lib
```
*If the last command fails, manually copy the `splunklib` in `/etc/apps/searchcommands_app/lib` directory inside container*


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

Log in into the Splunk UI.


## Example searches

### countmatches
```
| inputlookup tweets | countmatches fieldname=word_count pattern="\\w+" text
```
Results:
text | word_count
:----|:---|
excellent review my friend loved it yours always guppyman @GGreeny62... http://t.co/fcvq7NDHxl | 14
Tú novia te ama mucho | 5
... |

### filter
```
| generatetext text="Hello world! How the heck are you?" count=6 \
| filter predicate="(int(_serial) & 1) == 0" update="_raw = _raw.replace('world', 'Splunk')"
```
Results:
Event |
:-----|
2. Hello Splunk! How the heck are you? |
4. Hello Splunk! How the heck are you? |
6. Hello Splunk! How the heck are you? |

### generatetext
```
| generatetext count=3 text="Hello there"
```
Results:
Event |
:-----|
1. Hello there | 
2. Hello there |
3. Hello there |

### simulate
```
| simulate csv="/opt/splunk/etc/apps/searchcommands_app/default/data/population.csv" rate=10 interval=00:00:01 duration=00:00:02 seed=9
```
Results:
Event |
:-----|
text = Margarita (8) |
text = RT @Habibies: When you were born, you cried and the world rejoiced. Live your life so that when you die, the world will cry and you will re... |
text = @dudaribeiro_13 q engraçado em. |

### sum
```
| inputlookup tweets 
| countmatches fieldname=word_count pattern="\\w+" text
| sum total=word_counts word_count
```
Results:
word_counts |
:-----|
4497.0 |

## License

This software is licensed under the Apache License 2.0. Details can be found in
the file LICENSE.
