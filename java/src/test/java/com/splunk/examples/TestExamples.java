package com.splunk.examples;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

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
    public void endpointInstantiationExampleTest(){
        try {
            assertEquals(0,executeEndpointInstantiationExample());
            System.out.println("Endpoint Instantiation example test passed !!!");
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
    public void pivotExampleTest(){
        try {
            assertEquals(0,executePivotExample());
            System.out.println("Pivot example test passed !!!");
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

    public int executeEndpointInstantiationExample() throws IOException, InterruptedException {
        System.out.println("Running Endpoint Instantiation Example.....");
        String[] cmd = {"make", "run", "TARGET=endpoint_instantiation"};
        return executeCommand(cmd);
    }

    public int executeExportExample() throws IOException, InterruptedException {
        System.out.println("Running Export Example.....");
        String[] cmd = {"make", "run", "TARGET=export"};
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

    public int executePivotExample() throws IOException, InterruptedException {
        System.out.println("Running Pivot Example.....");
        String[] cmd = {"make", "run", "TARGET=pivot"};
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
        BufferedReader is =
                new BufferedReader(new InputStreamReader(p.getInputStream()));

        BufferedReader es =
                new BufferedReader(new InputStreamReader(p.getErrorStream()));
        String line;

        while ((line = is.readLine(  )) != null)
            System.out.println(line);

        while ((line = es.readLine(  )) != null)
            System.out.println(line);
    }

    public int executeCommand(String[] cmd) throws IOException, InterruptedException {
        Process process = runtime.exec(cmd);
        printResults(process);
        return process.waitFor();
    }
    
}
