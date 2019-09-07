0. Please read entire guide before deployment 
1. Double check UI and Code
2. Contact Customer, ask when he will have free time to deploy the app
3. Setup TimeViewer
4. Put data from .env into request.php (production request)
5. Bump npm package version
6. Update package.json's homepage field.
Set it to: `https://ya-service-nissan.ru/ticalc${version}/`
7. In project dir run `yarn build:prod`
8. Remove from build folder:
    1. dev_request.php
    2. static/js/runtime~*.js
    3. static/js/runtime~*.js.map
    4. static/js/2.*.js.map
9. Pack everything inside `build` folder into zip archive called `build_${version}.zip`
10. Send archive to Customer in VK
11. Connect to Customer via TeamViewer
12. In Site admin root copy old app folder to new folder with name `ticalc${version}`
13. Remove all files from root of new folder
(**only** from root, do not touch any other dirs)
14. Recursively remove all files from static folder
15. Upload all files into new app folder and `static` dir
16. On my machine validate that app is working on the new url
17. Change the url of the app in VK
18. Validate that app is working inside VK
19. Validate that it's the last version of the app
20. Change url in Yandex 14Metrika
21. Remove old app folder from Site admin
22. Remove build folder from downloads
23. Disconnect from Customer
24. Revert changes in request.php
25. Revert **only** homepage field in package.json
26. Commit changes in npm package version.
27. *optional* Order yourself pizza for a good work!
