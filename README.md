# dis-web-tool

**Dissertation project. An instructional tool for CTF infrastructure setup. By Jonah Robinson.**

My tool is intended to allow Capture the Flag organisers to explore different infrastructure technology options. 

Currently comparing and evaluating different technologies is not a simple task. Information repositories on different software and frameworks are scattered across the web and technical specifications often do not consider the context of CTF events. My tool brings this technology information together in one place and links each technology with respective past CTF events, thus giving contextual information such as:

- Scalability in a CTF environment.
- Challenge categories previously handled.
- Popularity among CTF organisers.

Technologies and CTF events can be easily compared against each other based on these attributes, giving organisers confident in their decisions whilst designing their next CTF competition infrastructure setup.

## Required software

Node.js, can be downloaded at: https://nodejs.org/en/

(Optional) Git, can be downloaded at: https://git-scm.com/downloads

## Installation Instructions

```bash
 git clone https://github.com/jonahtomrobinson/dis-web-tool.git
 cd dis-web-tool
 npm install
 npm run dev
```

Alternatively download and unzip https://github.com/jonahtomrobinson/dis-web-tool/archive/master.zip)

**After: Navigate to http://localhost:8080/** 

### Admin access details (case sensitive):

> username: demo

>password: Password123

## Optional tasks to explore web-tool functionality 

**Admin side**

1. Add a new CTF event.
2. Add a new technology.
3. Assign your technology to your new event.
4. Delete a technology/event/category/purpose.
5. Edit a technology/event/category/purpose.
6. Unassign your technology from your event.

   

**Client side**

1. Find the description of technology: CTFd.
2. Find the largest user count for technology: Docker.
3. Find the cost of technology: VMware vSphere.
4. Find a CTF event which ran a buffer overflow challenge.
5. Filter CTF events to find an event which had less than 100 attendees.
6. Find the technologies with the purpose “Virtual Machines & Containers” and compare two of them to see which is more popular.

## Survey

Link: https://forms.ncl.ac.uk/view.php?id=4686779
