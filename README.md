# dis-web-tool

> Dissertation project. An instructional tool for CTF infrastructure setup. By Jonah Robinson.

My tool is intended to allow Capture the Flag organisers to explore different infrastructure technology options. Currently comparing and evaluating different technologies is not a simple task. Information repositories on different software and frameworks are scattered across the web and technical specifications often do not consider the context of CTF events. My tool brings this technology information together in one place and links each technology with respective past CTF events, thus giving contextual information such as: scalability in a CTF environment, challenge categories previously handled, and popularity among CTF organisers. Technologies and CTF events can be easily compared against each other based on these attributes, allowing organisers to feel confident on the  decisions they make for their next CTF competition infrastructure setup.

Survey: https://forms.ncl.ac.uk/view.php?id=4686779

## Required software

>Node.js, can be downloaded at: https://nodejs.org/en/

>(Optional) Git, can be downloaded at: https://git-scm.com/downloads

## Installation Instructions

IN COMMAND LINE/ SHELL:
1. git clone https://github.com/jonahtomrobinson/dis-web-tool.git 
>(Alternatively download and unzip https://github.com/jonahtomrobinson/dis-web-tool/archive/master.zip)
2. cd dis-web-tool
3. npm install
4. npm run dev
5. Navigate to http://localhost:8080/

### Admin access details (case sensitive):

>username: demo

>password: Password123

## Optional tasks to explore web-tool functionality 

Admin side
1)	Add a new CTF event.
2)	Add a new technology.
3)	Assign your technology to your new event.
4)	Delete a technology/event/category/purpose.
5)	Edit a technology/event/category/purpose.
6)	Unassign your technology from your event.

Client side
1)	Find the description of technology: CTFd.
2)	Find the largest user count for technology: Docker.
3)	Find the cost of technology: VMware vSphere.
4)	Find a CTF event which ran a buffer overflow challenge.
5)	Filter CTF events to find an event which had less than 100 attendees.
6)	Find the technologies with the purpose “Virtual Machines & Containers” and compare two of them to see which is more popular.

