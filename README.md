## How to run
* Download or clone this project.
* Open terminal in the folder that you place this project (the folder contains these files: index.js, package.json,...).
* Write **npm i** to the termial, press **Enter** and wait for the process complete.
* If the folder **node_modules** appears in your folder, it means the process complete. If not, run the command above again.
* Write ***command line*** with the following syntax:  **node index | typeTime | intervalGetData | intervalStopProgram**. 
* 1. **typeTime**: the type of time you want the program runs. It includes 3 types: **'h'** is hour, **'m'** is minute, **'s'** is second.
    2. **intervalGetData**:  the interval you want the program get data after a certain time. It is a number.
    3. **intervalStopProgram**: the interval you want the program stop after getting data. It is a number and must be larger or equal **intervalGetData**.
* Example: **node index s 1 5** means the program gets data after every **1 second** and the program will stop after **5 second**. Similar with the other type of time.
* The result will be created in folder 'resultData' when the program notifies **Complete getting data**. Press Ctrl + C to turn off program.