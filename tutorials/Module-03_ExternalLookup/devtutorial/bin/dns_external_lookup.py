""" This is an example external lookup script for the tutorial, "Module 3: Create an external lookup for Splunk Cloud Platform or Splunk Enterprise".
It matches the 'host' and 'ip' fields in your search results with information from an external DNS server.
Save the script in $SPLUNK_HOME/etc/apps/devtutorial/bin and modify $SPLUNK_HOME/etc/apps/devtutorial/default/transforms.conf to add the script to your app configuration.
To run the script, use the lookup command in a search in Splunk Web.
"""

# Enter import statements
import csv
import sys
import socket




# Enter code to return ip if given host
def lookup(host):
    try:
        hostname, aliaslist, ipaddrlist = socket.gethostbyname_ex(host)
        return ipaddrlist
    except:
        return []

# Enter code to return host if given ip
def rlookup(ip):
    try:
        hostname, aliaslist, ipaddrlist = socket.gethostbyaddr(ip)
        return hostname
    except:
        return ''

    # Enter code to define the main() function
def main():
    if len(sys.argv) != 3:
        print("Usage: python dns_external_lookup.py [host field] [ip field]")
        sys.exit(1)

    hostfield = sys.argv[1]
    ipfield = sys.argv[2]

    infile = sys.stdin
    outfile = sys.stdout

    r = csv.DictReader(infile)
    header = r.fieldnames

    w = csv.DictWriter(outfile, fieldnames=r.fieldnames)
    w.writeheader()

    # Create for loop to populate missing values and return data to search results
    for result in r:
        # Perform the lookup or reverse lookup if necessary
        if result[hostfield] and result[ipfield]:
            # both fields were provided, just pass it along
            w.writerow(result)

        elif result[hostfield]:
            # only host was provided, add ip
            ips = lookup(result[hostfield])
            for ip in ips:
                result[ipfield] = ip
                w.writerow(result)

        elif result[ipfield]:
            # only ip was provided, add host
            result[hostfield] = rlookup(result[ipfield])
            if result[hostfield]:
                w.writerow(result)

main()
