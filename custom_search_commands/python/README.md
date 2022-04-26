splunk-sdk-python custom search commands example
=============================================

## Types of custom search commands

#### Streaming CSC
+ A streaming command operates on each event as the event is returned by a search.
  + A distributable streaming command runs on the indexer or the search head, depending on where in the search the command is invoked. Distributable streaming commands can be applied to subsets of indexed data in a parallel manner.
  + A centralized streaming command applies a transformation to each event returned by a search. Unlike distributable streaming commands, a centralized streaming command only works on the search head.

#### Reporting/Transforming CSC
+ A transforming command orders the search results into a data table. These commands "transform" the specified cell values for each event into numerical values that Splunk software can use for statistical purposes. 
+ Transforming commands are not streaming. Also, transforming commands are required to transform search result data into the data structures that are required for visualizations such as column, bar, line, area, and pie charts.
+ Transforming commands include: chart, timechart, stats, top, rare, and addtotals when it is used to calculate column totals (not row totals).

#### Generating CSC
+ A generating command fetches information from the indexes, without any transformations. Generating commands are either event-generating (distributable or centralized) or report-generating.
+ Generating commands do not expect or require an input. Generating commands are usually invoked at the beginning of the search and with a leading pipe.
+ Examples of generating commands include: dbinspect, datamodel, inputcsv, metadata, pivot, search, and tstats

#### Eventing/Dataset processing CSC
+ There are a handful of commands that require the entire dataset before the command can run. These commands are referred to as dataset processing commands. These commands are not transforming, not distributable, not streaming.
+ Some of these commands fit into other types in specific situations or when specific arguments are used.
+ Examples of data processing commands include: sort, eventstats, and some modes of cluster, dedup, and fillnull.
