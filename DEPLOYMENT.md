1. Double check UI and Code
2. Contact Customer, ask when he will have free time to deploy the app
3. Setup TimeViewer
4. Put data from .env into request.php (production request)
5. Bump npm package version
6. Update url: update version as the last symbol in the url
7. In project dir run `yarn build:prod`
8. Remove from bulid folder:
    1. dev_request.php
    2. static/js/runtime~*.js
    3. static/js/runtime~*.js.map
    4. static/js/2.*.js.map
9. Pack everything inside `build` into zip archive called `build_${version}.zip`
10. Send archive to Customer in VK
11. Connect to Customer via TeamViewer
12. In the Site admin create folder for new app, upload all files into it
13. On my machine validate that app is working on the new url
14. Change the url of the app in VK
15. Validate that app is working inside VK
16. Validate that it's the last version of the app
17. Change url in Metrika
18. Disconnect from Customer
19. Revert changes in request.php
20. Revert **only** homepage field in package.json
21. Commit changes in npm package version.
19. *optional* Order pizza for a good work!
