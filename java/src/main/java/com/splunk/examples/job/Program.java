package com.splunk.examples.job;

import com.splunk.*;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;

public class Program {

    private static void  list(Service service) {
        JobCollection jobs = service.getJobs();
        for(Job job : jobs.values()){
            System.out.println(job.getSid());
        }
    }

    private static void create(Service service, Args args) {
        JobCollection jobs = service.getJobs();
        String query = (String) args.get("query");
        if (query == null){
            Command.error("Please provide a search query");
            return;
        }
        args.remove("query");
        Job job = jobs.create(query,args);
        System.out.println(job.getSid() + " created successfully!!!!");
    }

    private static void cancel(Service service, Args args) {
        JobCollection jobs = service.getJobs();
        String sid = (String) args.get("sid");
        if (sid == null) {
            Command.error("Please provide an SID");
            return;
        }
        Job job = jobs.get(sid);
        if (job == null) {
            Command.error("Cannot find job with SID : " + sid);
            return;
        }
        job.cancel();
    }

    private static void events(Service service, Args args) {
        JobCollection jobs = service.getJobs();
        String sid = (String) args.get("sid");
        if (sid == null) {
            Command.error("Please provide an SID");
            return;
        }
        Job job = jobs.get(sid);
        if (job == null) {
            Command.error("Cannot find job with SID : " + sid);
            return;
        }

        writer(job.getEvents());
    }

    private static void finalizeJob(Service service, Args args) {
        JobCollection jobs = service.getJobs();
        String sid = (String) args.get("sid");
        if (sid == null) {
            Command.error("Please provide an SID");
            return;
        }
        Job job = jobs.get(sid);
        if (job == null) {
            Command.error("Cannot find job with SID : " + sid);
            return;
        }
        if (job.isFinalized()) {
            Command.error("The Job is already finalized");
            return;
        }
        job.finish();
    }

    private static void preview(Service service, Args args) {
        JobCollection jobs = service.getJobs();
        String sid = (String) args.get("sid");
        if (sid == null) {
            Command.error("Please provide an SID");
            return;
        }
        Job job = jobs.get(sid);
        if (job == null) {
            Command.error("Cannot find job with SID : " + sid);
            return;
        }

        writer(job.getResultsPreview());
    }

    private static void results(Service service, Args args) {
        JobCollection jobs = service.getJobs();
        String sid = (String) args.get("sid");
        if (sid == null) {
            Command.error("Please provide an SID");
            return;
        }
        Job job = jobs.get(sid);
        if (job == null) {
            Command.error("Cannot find job with SID : " + sid);
            return;
        }

        writer(job.getResults());
    }

    private static void searchlog(Service service, Args args) {
        JobCollection jobs = service.getJobs();
        String sid = (String) args.get("sid");
        if (sid == null) {
            Command.error("Please provide an SID");
            return;
        }
        Job job = jobs.get(sid);
        if (job == null) {
            Command.error("Cannot find job with SID : " + sid);
            return;
        }

        writer(job.getSearchLog());
    }

    private static void timeline(Service service, Args args) {
        JobCollection jobs = service.getJobs();
        String sid = (String) args.get("sid");
        if (sid == null) {
            Command.error("Please provide an SID");
            return;
        }
        Job job = jobs.get(sid);
        if (job == null) {
            Command.error("Cannot find job with SID : " + sid);
            return;
        }

        writer(job.getTimeline());
    }

    private static void summary(Service service, Args args) {
        JobCollection jobs = service.getJobs();
        String sid = (String) args.get("sid");
        if (sid == null) {
            Command.error("Please provide an SID");
            return;
        }
        Job job = jobs.get(sid);
        if (job == null) {
            Command.error("Cannot find job with SID : " + sid);
            return;
        }

        writer(job.getSummary());
    }

    private static void pause(Service service, Args args) {
        JobCollection jobs = service.getJobs();
        String sid = (String) args.get("sid");
        if (sid == null) {
            Command.error("Please provide an SID");
            return;
        }
        Job job = jobs.get(sid);
        if (job == null) {
            Command.error("Cannot find job with SID : " + sid);
            return;
        }

        if (job.isPaused()) {
            Command.error("The Job is already paused");
            return;
        }
        job.pause();
    }

    private static void unpause(Service service, Args args) {
        JobCollection jobs = service.getJobs();
        String sid = (String) args.get("sid");
        if (sid == null) {
            Command.error("Please provide an SID");
            return;
        }
        Job job = jobs.get(sid);
        if (job == null) {
            Command.error("Cannot find job with SID : " + sid);
            return;
        }

        if (!job.isPaused()) {
            Command.error("The Job is already unpaused");
            return;
        }

        job.control("unpause");
    }

    private static void touch(Service service, Args args) {
        JobCollection jobs = service.getJobs();
        String sid = (String) args.get("sid");
        if (sid == null) {
            Command.error("Please provide an SID");
            return;
        }
        Job job = jobs.get(sid);
        if (job == null) {
            Command.error("Cannot find job with SID : " + sid);
            return;
        }

        job.control("touch");
    }

    private static void writer(InputStream stream) {
        try (InputStreamReader reader = new InputStreamReader(stream, StandardCharsets.UTF_8);
             OutputStreamWriter writer = new OutputStreamWriter(System.out)) {
            int size = 1024;
            char[] buffer = new char[size];
            while (true) {
                int count = reader.read(buffer);
                if (count == -1) break;
                writer.write(buffer, 0, count);
            }
            writer.write("\n");
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    public static void main(String[] args) {
        Command command = Command.splunk("job");
        command.addRule("query", String.class, "Search query for the job");
        command.addRule("sid", String.class, "SID for the job");
        command.parse(args);
        HttpService.setValidateCertificates(false);
        Service service = Service.connect(command.opts);

        if (command.args.length == 0) {
            list(service);
            return;
        }

        String action = command.args[0];

        String query = null;
        if (command.opts.containsKey("query")) query = (String) command.opts.get("query");
        String sid = null;
        if (command.opts.containsKey("sid")) sid = (String) command.opts.get("sid");

        Args queryArgs = new Args();
        if (query != null) queryArgs.put("query", query);
        if (sid != null) queryArgs.put("sid", sid);

        if (command.args.length == 1) {
            if (action.equals("create")){
                create(service, queryArgs);
                return;
            }

            if (action.equals("cancel")) {
                cancel(service, queryArgs);
                return;
            }

            if (action.equals("events")) {
                events(service, queryArgs);
                return;
            }

            if (action.equals("finalize")) {
                finalizeJob(service, queryArgs);
                return;
            }

            if (action.equals("preview")) {
                preview(service, queryArgs);
                return;
            }

            if (action.equals("results")) {
                results(service, queryArgs);
                return;
            }

            if (action.equals("searchlog")) {
                searchlog(service, queryArgs);
                return;
            }

            if (action.equals("timeline")) {
                timeline(service, queryArgs);
                return;
            }

            if (action.equals("summary")) {
                summary(service, queryArgs);
                return;
            }

            if (action.equals("pause")) {
                pause(service, queryArgs);
                return;
            }

            if (action.equals("unpause")) {
                unpause(service, queryArgs);
                return;
            }

            if (action.equals("touch")) {
                touch(service, queryArgs);
                return;
            }
        }

        Command.error("Please provide a valid action");
    }
}
