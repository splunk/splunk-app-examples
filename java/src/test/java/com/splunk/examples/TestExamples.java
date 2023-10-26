package com.splunk.examples;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.UUID;

import static junit.framework.TestCase.assertEquals;

public class TestExamples {

    Runtime runtime;

    @Before
    public void setUp(){
        runtime = Runtime.getRuntime();
    }

    @After
    public void tearDown(){
        try {
            runtime.exec("rm export.out");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void confExampleTest(){
        String randomName = "delete-me-" + UUID.randomUUID();
        try {
            assertEquals(0,executeConfExample());
            assertEquals(0,executeConfCreateExample(randomName));
            assertEquals(0,executeConfStanzaCreateExample(randomName));
            assertEquals(0,executeConfReadExample(randomName));
            assertEquals(0,executeConfStanzaUpdateExample(randomName));
            assertEquals(0,executeConfStanzaReadExample(randomName));
            assertEquals(0,executeConfStanzaDeleteExample(randomName));
            System.out.println("Conf example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void endpointInstantiationExampleTest(){
        try {
            assertEquals(0,executeEndpointInstantiationExample());
            System.out.println("Endpoint Instantiation example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void eventTypesExampleTest(){
        try {
            assertEquals(0,executeEventTypesExample());
            System.out.println("Event Types example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void exportExampleTest(){
        try {
            assertEquals(0,executeExportExample());
            System.out.println("Export example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void firedAlertsExampleTest(){
        try {
            assertEquals(0,executeFiredAlertsExample());
            System.out.println("Fired Alerts example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void fluentPivotExampleTest(){
        try {
            assertEquals(0,executeFluentPivotExample());
            System.out.println("Fluent Pivot example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void geneventsExampleTest(){
        try {
            assertEquals(0,executeGeneventsExample());
            System.out.println("Genevents example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void getJobExampleTest(){
        try {
            assertEquals(0,executeGetJobExample());
            System.out.println("Get Job example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void indexExampleTest(){
        try {
            assertEquals(0,executeIndexExample());
            System.out.println("Index example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void infoExampleTest(){
        try {
            assertEquals(0,executeInfoExample());
            System.out.println("Info example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void inputExampleTest(){
        try {
            assertEquals(0,executeInputExample());
            System.out.println("Input example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void jobExampleTest(){
        try {
            assertEquals(0,executeJobExample());
            System.out.println("Job example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Ignore
    @Test
    public void kvStoreExampleTest(){
        String randomName = "delete-me-" + UUID.randomUUID();
        try {
            assertEquals(0,executeKVStoreExample());
            assertEquals(0,executeKVStoreCreateExample(randomName));
            assertEquals(0,executeKVStoreUpdateExample(randomName));
            assertEquals(0,executeKVStoreReadExample(randomName));
            assertEquals(0,executeKVStoreAddDataExample(randomName));
            assertEquals(0,executeKVStoreUpdateDataExample(randomName));
            assertEquals(0,executeKVStoreBatchSaveDataExample(randomName));
            assertEquals(0,executeKVStoreReadDataExample(randomName));
            assertEquals(0,executeKVStoreBatchFindDataExample(randomName));
            assertEquals(0,executeKVStoreDeleteDataExample(randomName));
            assertEquals(0,executeKVStoreDeleteExample(randomName));
            System.out.println("KV Store example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void loggerExampleTest(){
        try {
            assertEquals(0,executeLoggerExample());
            System.out.println("Logger example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void pivotExampleTest(){
        try {
            assertEquals(0,executePivotExample());
            System.out.println("Pivot example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void savedSearchExampleTest(){
        String randomName = "delete-me-" + UUID.randomUUID();
        try {
            assertEquals(0,executeSavedSearchExample());
            assertEquals(0,executeSavedSearchCreateExample(randomName));
            assertEquals(0,executeSavedSearchReadExample(randomName));
            assertEquals(0,executeSavedSearchUpdateExample(randomName));
            assertEquals(0,executeSavedSearchDeleteExample(randomName));
            System.out.println("Saved Search example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void searchExampleTest(){
        try {
            assertEquals(0,executeSearchExample());
            System.out.println("Search example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void searchBlockingExampleTest(){
        try {
            assertEquals(0,executeSearchBlockingExample());
            System.out.println("Search Blocking example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void searchOneshotExampleTest(){
        try {
            assertEquals(0,executeSearchOneshotExample());
            System.out.println("Search Oneshot example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void searchRealtimeExampleTest(){
        try {
            assertEquals(0,executeSearchRealtimeExample());
            System.out.println("Search Realtime example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void searchSavedExampleTest(){
        try {
            assertEquals(0,executeSearchSavedExample());
            System.out.println("Search Saved example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void searchSimpleExampleTest(){
        try {
            assertEquals(0,executeSearchSimpleExample());
            System.out.println("Search Simple example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void spurlExampleTest(){
        try {
            assertEquals(0,executeSpurlExample());
            System.out.println("Spurl example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void sslProtocolsExampleTest(){
        try {
            assertEquals(0,executeSslProtocolsExample());
            System.out.println("Ssl Protocols example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void tailExampleTest(){
        try {
            assertEquals(0,executeTailExample());
            System.out.println("Tail example test passed !!!");
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public int executeConfExample() throws IOException, InterruptedException {
        System.out.println("Running Conf Example.....");
        String[] cmd = {"make", "run", "TARGET=conf"};
        return executeCommand(cmd);
    }

    public int executeConfCreateExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running Conf Create Example.....");
        String[] cmd = {"make", "run", "TARGET=conf", String.format("ARGUMENTS=create %s",randomName)};
        return executeCommand(cmd);
    }

    public int executeConfReadExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running Conf Read Example.....");
        String[] cmd = {"make", "run", "TARGET=conf", String.format("ARGUMENTS=read %s",randomName)};
        return executeCommand(cmd);
    }

    public int executeConfStanzaCreateExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running Conf Stanza Create Example.....");
        String[] cmd = {"make", "run", "TARGET=conf", String.format("ARGUMENTS=create %s %s-stanza", randomName, randomName)};
        return executeCommand(cmd);
    }

    public int executeConfStanzaReadExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running Conf Stanza Read Example.....");
        String[] cmd = {"make", "run", "TARGET=conf", String.format("ARGUMENTS=read %s %s-stanza", randomName, randomName)};
        return executeCommand(cmd);
    }

    public int executeConfStanzaUpdateExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running Conf Stanza Update Example.....");
        String[] cmd = {"make", "run", "TARGET=conf", String.format("ARGUMENTS=update %s %s-stanza hello=world", randomName, randomName)};
        return executeCommand(cmd);
    }

    public int executeConfStanzaDeleteExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running Conf Stanza Delete Example.....");
        String[] cmd = {"make", "run", "TARGET=conf", String.format("ARGUMENTS=delete %s %s-stanza", randomName, randomName)};
        return executeCommand(cmd);
    }

    public int executeEndpointInstantiationExample() throws IOException, InterruptedException {
        System.out.println("Running Endpoint Instantiation Example.....");
        String[] cmd = {"make", "run", "TARGET=endpoint_instantiation"};
        return executeCommand(cmd);
    }

    public int executeEventTypesExample() throws IOException, InterruptedException {
        System.out.println("Running Event Types Example.....");
        String[] cmd = {"make", "run", "TARGET=event_types"};
        return executeCommand(cmd);
    }

    public int executeExportExample() throws IOException, InterruptedException {
        System.out.println("Running Export Example.....");
        String[] cmd = {"make", "run", "TARGET=export"};
        return executeCommand(cmd);
    }

    public int executeFiredAlertsExample() throws IOException, InterruptedException {
        System.out.println("Running Fired Alerts Example.....");
        String[] cmd = {"make", "run", "TARGET=fired_alerts"};
        return executeCommand(cmd);
    }

    public int executeFluentPivotExample() throws IOException, InterruptedException {
        System.out.println("Running Fluent Pivot Example.....");
        String[] cmd = {"make", "run", "TARGET=fluent_pivot"};
        return executeCommand(cmd);
    }

    public int executeGeneventsExample() throws IOException, InterruptedException {
        System.out.println("Running Genevents Example.....");
        String[] cmd = {"make", "run", "TARGET=genevents"};
        return executeCommand(cmd);
    }

    public int executeGetJobExample() throws IOException, InterruptedException {
        System.out.println("Running Get Job Example.....");
        String[] cmd = {"make", "run", "TARGET=get_job"};
        return executeCommand(cmd);
    }

    public int executeIndexExample() throws IOException, InterruptedException {
        System.out.println("Running Index Example.....");
        String[] cmd = {"make", "run", "TARGET=index"};
        return executeCommand(cmd);
    }

    public int executeInfoExample() throws IOException, InterruptedException {
        System.out.println("Running Info Example.....");
        String[] cmd = {"make", "run", "TARGET=info"};
        return executeCommand(cmd);
    }

    public int executeInputExample() throws IOException, InterruptedException {
        System.out.println("Running Input Example.....");
        String[] cmd = {"make", "run", "TARGET=input"};
        return executeCommand(cmd);
    }

    public int executeJobExample() throws IOException, InterruptedException {
        System.out.println("Running Job Example.....");
        String[] cmd = {"make", "run", "TARGET=job"};
        return executeCommand(cmd);
    }

    public int executeKVStoreExample() throws IOException, InterruptedException {
        System.out.println("Running KV Store Example.....");
        String[] cmd = {"make", "run", "TARGET=kvstore"};
        return executeCommand(cmd);
    }

    public int executeKVStoreCreateExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running KV Store Create Example.....");
        String[] cmd = {"make", "run", "TARGET=kvstore", String.format("ARGUMENTS=create --name=%s --profiling_enabled=true --profiling_threshold_ms=1200",randomName)};
        return executeCommand(cmd);
    }

    public int executeKVStoreReadExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running KV Store Read Example.....");
        String[] cmd = {"make", "run", "TARGET=kvstore", String.format("ARGUMENTS=read --name=%s",randomName)};
        return executeCommand(cmd);
    }

    public int executeKVStoreUpdateExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running KV Store Update Example.....");
        String[] cmd = {"make", "run", "TARGET=kvstore", String.format("ARGUMENTS=update --name=%s --field=\"field.a=number\" --accelerated_fields=\"accelerated_fields.a={key:1}\"",randomName)};
        return executeCommand(cmd);
    }

    public int executeKVStoreDeleteExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running KV Store Delete Example.....");
        String[] cmd = {"make", "run", "TARGET=kvstore", String.format("ARGUMENTS=delete --name=%s",randomName)};
        return executeCommand(cmd);
    }

    public int executeKVStoreAddDataExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running KV Store Add Data Example.....");
        String[] cmd = {"make", "run", "TARGET=kvstore", String.format("ARGUMENTS=addData --name=%s --json_data=\\\"{key1:val1,_key:randomData}\\\"",randomName)};
        return executeCommand(cmd);
    }

    public int executeKVStoreReadDataExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running KV Store Read Data Example.....");
        String[] cmd = {"make", "run", "TARGET=kvstore", String.format("ARGUMENTS=readData --name=%s",randomName)};
        return executeCommand(cmd);
    }

    public int executeKVStoreUpdateDataExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running KV Store Update Data Example.....");
        String[] cmd = {"make", "run", "TARGET=kvstore", String.format("ARGUMENTS=updateData --name=%s --json_data=\\\"{key2:val2,_key:randomData}\\\" --key=randomData",randomName)};
        return executeCommand(cmd);
    }

    public int executeKVStoreDeleteDataExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running KV Store Delete Data Example.....");
        String[] cmd = {"make", "run", "TARGET=kvstore", String.format("ARGUMENTS=deleteData --name=%s",randomName)};
        return executeCommand(cmd);
    }

    public int executeKVStoreBatchSaveDataExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running KV Store Batch Save Data Example.....");
        String[] cmd = {"make", "run", "TARGET=kvstore", String.format("ARGUMENTS=batchSave --name=%s --json_data=\\\"[{keyx:valx,keyy:valy,keyz:valz},{key1:val1,keya:vala},{keya:vala,keyx:valx},{key2:val2, key1:val1}]\\\"",randomName)};
        return executeCommand(cmd);
    }

    public int executeKVStoreBatchFindDataExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running KV Store Batch Find Data Example.....");
        String[] cmd = {"make", "run", "TARGET=kvstore", String.format("ARGUMENTS=batchFind --name=%s --json_data=\\\"[{query:{key1:val1}},{query:{keyx:def}},{query:{keyx: valx}}]\\\"",randomName)};
        return executeCommand(cmd);
    }

    public int executeLoggerExample() throws IOException, InterruptedException {
        System.out.println("Running Logger Example.....");
        String[] cmd = {"make", "run", "TARGET=logger"};
        return executeCommand(cmd);
    }

    public int executePivotExample() throws IOException, InterruptedException {
        System.out.println("Running Pivot Example.....");
        String[] cmd = {"make", "run", "TARGET=pivot"};
        return executeCommand(cmd);
    }

    public int executeSavedSearchExample() throws IOException, InterruptedException {
        System.out.println("Running Saved Search Example.....");
        String[] cmd = {"make", "run", "TARGET=saved_search"};
        return executeCommand(cmd);
    }

    public int executeSavedSearchCreateExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running Saved Search Create Example.....");
        String[] cmd = {"make", "run", "TARGET=saved_search", String.format("ARGUMENTS=create --name=%s --search='search index=main'", randomName)};
        return executeCommand(cmd);
    }

    public int executeSavedSearchReadExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running Saved Search Read Example.....");
        String[] cmd = {"make", "run", "TARGET=saved_search", String.format("ARGUMENTS=read --name=%s", randomName)};
        return executeCommand(cmd);
    }

    public int executeSavedSearchUpdateExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running Saved Search Update Example.....");
        String[] cmd = {"make", "run", "TARGET=saved_search", String.format("ARGUMENTS=update --name=%s --dispatch.buckets=5 --dispatch.max_count=10", randomName)};
        return executeCommand(cmd);
    }

    public int executeSavedSearchDeleteExample(String randomName) throws IOException, InterruptedException {
        System.out.println("Running Saved Search Delete Example.....");
        String[] cmd = {"make", "run", "TARGET=saved_search", String.format("ARGUMENTS=delete --name=%s", randomName)};
        return executeCommand(cmd);
    }

    public int executeSearchExample() throws IOException, InterruptedException {
        System.out.println("Running Search Example.....");
        String[] cmd = {"make", "run", "TARGET=search", "ARGUMENTS='search index=_audit source=audittrail'"};
        return executeCommand(cmd);
    }

    public int executeSearchBlockingExample() throws IOException, InterruptedException {
        System.out.println("Running Search Blocking Example.....");
        String[] cmd = {"make", "run", "TARGET=search_blocking", "ARGUMENTS='search index=_audit source=audittrail' --raw=0"};
        return executeCommand(cmd);
    }

    public int executeSearchOneshotExample() throws IOException, InterruptedException {
        System.out.println("Running Search Oneshot Example.....");
        String[] cmd = {"make", "run", "TARGET=search_oneshot", "ARGUMENTS='search index=_audit source=audittrail'"};
        return executeCommand(cmd);
    }

    public int executeSearchRealtimeExample() throws IOException, InterruptedException {
        System.out.println("Running Search Realtime Example.....");
        String[] cmd = {"make", "run", "TARGET=search_realtime", "ARGUMENTS='search index=_audit source=audittrail' --raw=1"};
        return executeCommand(cmd);
    }

    public int executeSearchSavedExample() throws IOException, InterruptedException {
        System.out.println("Running Search Saved Example.....");
        String[] cmd = {"make", "run", "TARGET=search_saved"};
        return executeCommand(cmd);
    }

    public int executeSearchSimpleExample() throws IOException, InterruptedException {
        System.out.println("Running Search Simple Example.....");
        String[] cmd = {"make", "run", "TARGET=search_simple", "ARGUMENTS='search index=_audit source=audittrail'"};
        return executeCommand(cmd);
    }

    public int executeSpurlExample() throws IOException, InterruptedException {
        System.out.println("Running Spurl Example.....");
        String[] cmd = {"make", "run", "TARGET=spurl"};
        return executeCommand(cmd);
    }

    public int executeSslProtocolsExample() throws IOException, InterruptedException {
        System.out.println("Running Ssl Protocols Example.....");
        String[] cmd = {"make", "run", "TARGET=ssl_protocols"};
        return executeCommand(cmd);
    }

    public int executeTailExample() throws IOException, InterruptedException {
        System.out.println("Running Tail Example.....");
        String[] cmd = {"make", "run", "TARGET=tail", "ARGUMENTS='search index=_audit source=audittrail | head 2'"};
        return executeCommand(cmd);
    }

    public static void printResults(Process p) throws IOException {
        try (BufferedReader is = new BufferedReader(new InputStreamReader(p.getInputStream()));
             BufferedReader es = new BufferedReader(new InputStreamReader(p.getErrorStream()))) {
            String line;

            while ((line = is.readLine(  )) != null)
                System.out.println(line);

            while ((line = es.readLine(  )) != null)
                System.out.println(line);
        }
    }

    public int executeCommand(String[] cmd) throws IOException, InterruptedException {
        Process process = runtime.exec(cmd);
        printResults(process);
        return process.waitFor();
    }
}
