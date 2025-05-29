**Motivation:**  
The online live editor becomes very laggy with large files. This approach uses a Node service to generate the output instead of running Node in the browser, resulting in much faster performance when handling larger files.
Another issue, is that it seems like the online live editor does not have any debounce. So ANY change, it reruns the javascript - this is heavily bad experience for big diagrams. Here, you have control over when it runs. Every time you save, it causes a rerender.
The biggest downside here is that you cannot interact with the diagram itself to add nodes, etc. Personally, that wasn't an issue for me.

**Goal:**  
To eventually add a folder picker synced to the `mermaid_files` folder.

**Set Up:**
Ensure you have docker, and run `docker-compose up --build`. For now, you can only modify edit.mmd. Features incoming for this.
If you don't want to use docker because of its egregious ram and storage requirements, you can run the backend and frontend locally. Refer to their respective package.json file for this.
