Docker can be used to make development environments for different developers more consistent
which can reduce the amount of environment troubleshooting.  Implementing docker for 
development was explored on July 19, 2025 by Ethan Strominger.  Docker was successfully
set up to run the node server.  Several issues that make the use of it problematic.   For this reason, it was decided not to pursue Docker for development further.  docker for production may still be considered.  

docker-compose.yaml and dev.Dockerfile were preserved.  They files are coded to fail with an error message pointing to docker-compose-for-dev.md.  Here are some of the issues:
- Building the image with `docker compose build` takes a long time
- Web page localhost:3000 did not automatically refresh when tsx code changed.  The refresh works in local and Codespace.  If you refresh the browser, the node server is restarted and changes are seen.
- Starting containers with `docker compose up` takes a long time.
- More potentially significant issues may be discovered
- Codespace serves the same purpose, is quicker, and has been in use for a while
